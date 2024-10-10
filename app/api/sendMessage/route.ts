// app/api/sendMessage/route.ts (for App Router) or pages/api/sendMessage.ts (for Pages Router)

import { NextResponse } from "next/server";
import { client } from "../../../bot/discordBot";
import { TextChannel, DMChannel, NewsChannel } from "discord.js";

export async function POST(request: Request) {
  const { channelId, message } = await request.json();

  try {
    const channel = await client.channels.fetch(channelId);

    // Type guard to check if it's a valid channel for sending messages
    if (
      channel instanceof TextChannel ||
      channel instanceof DMChannel ||
      channel instanceof NewsChannel
    ) {
      await channel.send(message);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid channel type for sending messages",
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
