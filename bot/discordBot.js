// bot/discordBot.ts
import { Client, GatewayIntentBits, PermissionFlagsBits } from "discord.js";
import dotenv from "dotenv";
import { getOpenAIResponse } from "./openAi.js";

// Load environment variables
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required to read message contents
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (message) => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  try {
    const reply = await getOpenAIResponse(message.content);
    await message.channel.send(reply);
  } catch (error) {
    console.error("Error responding to message:", error);
    await message.channel.send(
      "Sorry, something went wrong while processing your request."
    );
  }
});

process.on("SIGINT", () => {
  console.log("Shutting down bots...");
  shutdownBots();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down bots...");
  shutdownBots();
  process.exit(0);
});

// Generate bot invite link
export const getInviteLink = async (token) => {
  const loggedIn = await client.login(token);
  if (!loggedIn) {
    return "Failed to login";
  }
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
  return inviteLink;
};

export { client };
