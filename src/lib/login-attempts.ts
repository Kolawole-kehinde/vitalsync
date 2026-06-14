import { redis } from "./redis";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60;

export async function incrementLoginAttempts(
  email: string
) {
  const key =
    `login_attempts:${email}`;

  const attempts =
    await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(
      key,
      LOCK_DURATION
    );
  }

  return attempts;
}

export async function getLoginAttempts(
  email: string
) {
  const key =
    `login_attempts:${email}`;

  const count =
    await redis.get(key);

  return Number(count ?? 0);
}

export async function resetLoginAttempts(
  email: string
) {
  const key =
    `login_attempts:${email}`;

  await redis.del(key);
}