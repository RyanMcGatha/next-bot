// app/api/inviteBot/route.ts (or pages/api/inviteBot.ts for Pages Router)
import { NextResponse } from "next/server";
import { getInviteLink } from "../../../bot/discordBot"; // Adjust path as needed

export async function GET() {
  const inviteLink = getInviteLink();
  if (inviteLink) {
    return NextResponse.json({ success: true, inviteLink });
  }
  return NextResponse.json({
    success: false,
    error: "Bot is not ready or client ID is missing",
  });
}
