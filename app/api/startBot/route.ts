import { NextRequest, NextResponse } from "next/server";
import { startBot } from "../../../bot/startBot";
import { updateBotStatus } from "../../../bot/helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { botId, prompt, name, discordToken } = body;

    // Validate required fields
    if (!botId || !prompt || !name || !discordToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update bot status
    try {
      await updateBotStatus(botId, true);
    } catch (error) {
      console.error("Error updating bot status:", error);
      return NextResponse.json(
        { error: "Failed to update bot status" },
        { status: 500 }
      );
    }

    // Start the bot
    try {
      const { client, inviteLink } = await startBot(prompt, name, discordToken);

      return NextResponse.json(
        {
          message: "Bot created successfully",
          data: { inviteLink, botName: client.user?.username },
        },
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
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
