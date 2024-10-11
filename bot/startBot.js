import { Client, GatewayIntentBits, PermissionFlagsBits } from "discord.js";
import { getOpenAIResponse } from "./openAi.js";
import {
  addEventToCalendar,
  getAuthUrl,
  hasValidToken,
  authenticate,
} from "./googleCalenderServiece.js";

async function createDiscordBot(prompt, botName, discordToken) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  let isScheduling = false;

  client.once("ready", async () => {
    console.log(`Bot created and logged in as ${client.user.tag}!`);
    const guilds = client.guilds.cache.map((guild) => guild);
    for (const guild of guilds) {
      await ensurePermissions(client, guild);
      const member = guild.members.cache.get(client.user.id);
      if (member) {
        await member.setNickname(botName);
        console.log(`Nickname set to ${botName} in guild: ${guild.name}`);
      }
    }
  });

  client.on("guildCreate", async (guild) => {
    await ensurePermissions(client, guild);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "/book") {
      if (hasValidToken()) {
        isScheduling = true;
        await message.reply(
          "Great! Let's schedule a meeting. Please provide the meeting summary."
        );
        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({
          filter,
          time: 60000,
          max: 1,
        });

        collector.on("collect", async (m) => {
          const summary = m.content;
          await m.reply(
            `Summary received: "${summary}". Now, please provide the start time and end time or duration (e.g., "9am saturday to 10am" or "tomorrow at 2pm for 1 hour").`
          );

          const timeCollector = message.channel.createMessageCollector({
            filter,
            time: 60000,
            max: 1,
          });

          timeCollector.on("collect", async (m) => {
            const timeInput = m.content;

            try {
              let prompt = `Convert the following time input to ISO 8601 format for both start and end times, if no year or month is provided, use the current year and month: "${timeInput}". Respond with two ISO 8601 formatted dates separated by a comma, representing the start and end times respectively. Only provide the formatted dates, nothing else.`;
              const aiResponse = await getOpenAIResponse(prompt, timeInput);
              console.log(aiResponse);

              const [startTimeStr, endTimeStr] = aiResponse
                .split(",")
                .map((str) => str.trim());
              const startTime = new Date(startTimeStr);
              const endTime = new Date(endTimeStr);

              if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                throw new Error("Invalid date");
              }

              try {
                const eventDetails = {
                  summary,
                  start: startTime.toISOString(),
                  end: endTime.toISOString(),
                };
                const result = await addEventToCalendar(eventDetails);
                await m.reply(`Meeting scheduled successfully! ${result}`);
              } catch (error) {
                console.error("Error scheduling meeting:", error);
                await m.reply(
                  "An error occurred while scheduling the meeting. Please try again."
                );
              } finally {
                isScheduling = false;
              }
            } catch (error) {
              console.log(error);
              await m.reply(
                "I couldn't understand that time format. Please try again with the /book command."
              );
              isScheduling = false;
            }
          });
        });
        return;
      } else {
        // No token, start authentication process
        const authUrl = getAuthUrl();
        await message.reply(
          `Please authenticate with Google Calendar by visiting this URL: ${authUrl}`
        );
        return;
      }
    }

    // Only process messages with OpenAI if not scheduling an event
    if (!isScheduling) {
      try {
        const userMessage = message.content;
        const response = await getOpenAIResponse(userMessage, prompt);
        await message.channel.send(response);
      } catch (error) {
        console.error("Error processing message with OpenAI:", error);
        await message.channel.send(
          "I'm sorry, I encountered an error while processing your message. Please try again later."
        );
      }
    }
  });

  await client.login(discordToken);
  const inviteLink = await client.generateInvite({
    scopes: ["bot"],
    permissions: [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ChangeNickname,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.ReadMessageHistory,
    ],
  });

  async function ensurePermissions(client, guild) {
    const requiredPermissions = [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ChangeNickname,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.ReadMessageHistory,
    ];

    const botMember = guild.members.cache.get(client.user.id);
    const missingPermissions = requiredPermissions.filter(
      (perm) => !botMember.permissions.has(perm)
    );

    if (missingPermissions.length > 0) {
      const permissionNames = missingPermissions.map((perm) =>
        Object.keys(PermissionFlagsBits).find(
          (key) => PermissionFlagsBits[key] === perm
        )
      );

      console.log(
        `Missing permissions in guild ${guild.name}: ${permissionNames.join(
          ", "
        )}`
      );

      try {
        const owner = await guild.fetchOwner();
        await owner.send(
          `Hello! I'm missing some permissions in your server "${guild.name}". ` +
            `Please grant me the following permissions to ensure I can function properly: ` +
            `${permissionNames.join(
              ", "
            )}. You can update my permissions in the server settings.`
        );
      } catch (error) {
        console.error(
          `Failed to notify guild owner about missing permissions: ${error}`
        );
      }
    }
  }

  return { client, inviteLink };
}

export { createDiscordBot };
