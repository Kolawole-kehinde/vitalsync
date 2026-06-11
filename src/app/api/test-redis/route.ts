// app/api/test-redis/route.ts

import { redis } from "@/src/lib/redis";



export async function GET() {
  await redis.set("name", "kehinde");

  const value = await redis.get("name");

  return Response.json({ value });
}