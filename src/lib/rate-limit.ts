import { redis } from "@/src/lib/redis";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function rateLimit(data: RateLimitOptions) {
  const count = await redis.incr(data.key);

  if (count === 1) {
     await redis.expire(
      data.key,
      data.windowSeconds
    );
  }

  return {
    allowed: count <= data.limit,
    remaining: Math.max(
      data.limit - count,
      0
    ),
    count,
  };
}