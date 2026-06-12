import { redis } from "@/src/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const keys = await redis.keys("*");

  const result = [];

  for (const key of keys) {
    const value = await redis.get(key);

    result.push({
      key,
      value,
    });
  }

  return NextResponse.json(result);
}