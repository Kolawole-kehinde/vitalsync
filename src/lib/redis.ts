import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("ready", () => {
  console.log("Redis Ready");
});

redis.on("error", (error) => {
  console.error(
    " Redis Error:",
    error
  );
});

redis.on("close", () => {
  console.log(
    "Redis Connection Closed"
  );
});

redis.on("reconnecting", () => {
  console.log(
    "Redis Reconnecting..."
  );
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}