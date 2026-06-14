import argon2 from "argon2";

import { generateOTP } from "@/src/lib/otp";
import { redis } from "@/src/lib/redis";


/*
generate OTP
hash OTP
store in Redis
*/

export async function createVerificationOtp( email: string) {
  const otp = generateOTP();

  const otpHash =
    await argon2.hash(otp);

  await redis.set(
    `otp:email-verification:${email}`,
    JSON.stringify({
      otpHash,
      attempts: 0,
      lockedUntil: null,
    }),
    "EX",
    15 * 60
  );

  return otp;
}