import { NextRequest, NextResponse } from "next/server";
import { getUserBots } from "../../../bot/helpers";

export async function GET(req: NextRequest, res: NextResponse) {
  const userId = req.nextUrl.searchParams.get("userId");
  const bots = await getUserBots(userId);
  return NextResponse.json({ bots });
}
