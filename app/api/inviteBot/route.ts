// app/api/inviteBot/route.ts (or pages/api/inviteBot.ts for Pages Router)
import { NextRequest, NextResponse } from "next/server";
import { getInviteLink } from "../../../bot/discordBot"; // Adjust path as needed

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const inviteLink = await getInviteLink(token);
  if (inviteLink) {
    return NextResponse.json({ success: true, inviteLink: inviteLink });
  }
  return NextResponse.json({
    success: false,
    error: "Bot is not ready or client ID is missing",
  });
}
