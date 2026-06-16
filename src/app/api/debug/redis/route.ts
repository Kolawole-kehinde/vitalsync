import { redis } from "@/src/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const key =
    "session:cmqh39k9a0005ugfowro21zcd";

  const session =
    await redis.get(key);

  return NextResponse.json(session);
}