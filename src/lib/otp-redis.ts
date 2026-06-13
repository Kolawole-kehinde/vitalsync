import { redis } from "./redis";

const OTP_PREFIX = "otp:email-verification:";

export async function saveOtp(email: string, otpHash: string) {
  await redis.set(
    `${OTP_PREFIX}${email}`,
    JSON.stringify({
      otpHash,
      attempts: 0,
    }),
    "EX",
    15 * 60,
  );
}

export async function getOtp(email: string) {
  return redis.get(`${OTP_PREFIX}${email}`);
}

export async function deleteOtp(email: string) {
  return redis.del(`${OTP_PREFIX}${email}`);
}
