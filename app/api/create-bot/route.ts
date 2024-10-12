import { NextRequest, NextResponse } from "next/server";
import { createBot } from "../../../bot/helpers";

export async function POST(req: NextRequest, res: NextResponse) {
  const { name, prompt, id, discordToken, inviteLink } = await req.json();

  try {
    const bot = await createBot(id, prompt, name, inviteLink, discordToken); // Passing id (creatorId) first
    return NextResponse.json({ bot });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bot." },
      { status: 500 }
    );
  }
}
