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
