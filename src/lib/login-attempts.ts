import { LOGIN_LOCK_DURATION } from "../constants/auth.constants";
import { redis } from "./redis";

export async function incrementLoginAttempts(email: string) {
  const key = `login_attempts:${email}`;

  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, LOGIN_LOCK_DURATION);
  }

  return attempts;
}

export async function getLoginAttempts(email: string) {
  const key = `login_attempts:${email}`;

  const count = await redis.get(key);

  return Number(count ?? 0);
}

export async function resetLoginAttempts(email: string) {
  const key = `login_attempts:${email}`;

  await redis.del(key);
}
