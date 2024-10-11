import { NextRequest, NextResponse } from "next/server";
import { createDiscordBot } from "../../../bot/startBot"; // Assuming the utility you're using for bot creation.
import { Client, GatewayIntentBits } from "discord.js";

const activeBots = new Map(); // Move this outside the function if you want the Map to persist across multiple requests.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, name, discordToken } = body;

    // Validate required fields
    if (!prompt || !name || !discordToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the Discord bot
    try {
      const { client, inviteLink } = await createDiscordBot(
        prompt,
        name,
        discordToken
      );

      // Store the active bot client
      activeBots.set(client.user!.id, client);

      return NextResponse.json(
        { message: "Bot created", data: { inviteLink } },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error creating Discord bot:", error);
      return NextResponse.json(
        { error: "Failed to create Discord bot" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
