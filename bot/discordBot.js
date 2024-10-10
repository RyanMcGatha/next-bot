// bot/discordBot.ts
import { Client, GatewayIntentBits } from "discord.js";
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

  // Simple command to respond to "!ping"
  if (message.content === "!ping") {
    message.channel.send("Pong!");
  }

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

// Log the bot in using the token from the .env file
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Error logging in: ", error);
});

// Generate bot invite link
export const getInviteLink = () => {
  const clientId = "1293740227541598258";
  console.log(clientId);
  if (clientId) {
    // Permissions can be customized as needed
    const permissions = 8; // 8 stands for Administrator (all permissions)
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`;
  }
  return null;
};

export { client };
