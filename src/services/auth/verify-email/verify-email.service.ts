import argon2 from "argon2";

import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { checkOtpVerifyRateLimit } from "./check-otp-verify-rate-limit";

type VerifyEmailData = {
  email: string;
  otp: string;
  ipAddress?: string;
  userAgent?: string;
};

type RedisOtpRecord = {
  otpHash: string;
  attempts: number;
  lockedUntil: number | null;
};

export async function verifyEmail(data: VerifyEmailData) {
  const email = data.email.trim().toLowerCase();

  const { otp, ipAddress, userAgent } = data;

  // Rate limits (email + IP)
  await checkOtpVerifyRateLimit(email, ipAddress);

  // Find pending registration
  const pending = await prisma.pendingRegistration.findUnique({
    where: {
      email,
    },
  });

  if (!pending) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser?.emailVerifiedAt) {
      throw new AuthError("Email already verified", 409);
    }

    throw new AuthError("Registration not found", 404);
  }

  // Get OTP from Redis
  const otpKey = `otp:email-verification:${email}`;

  const otpData = await redis.get(otpKey);

  if (!otpData) {
    throw new AuthError("OTP not found or expired", 404);
  }

  let otpRecord: RedisOtpRecord;

  try {
    otpRecord = JSON.parse(otpData) as RedisOtpRecord;
  } catch {
    throw new AuthError("Invalid OTP data", 400);
  }

  // Check lock
  if (otpRecord.lockedUntil && otpRecord.lockedUntil > Date.now()) {
    throw new AuthError(
      "Verification temporarily locked. Request a new code.",
      429,
    );
  }

  // Check attempt limit
  if (otpRecord.attempts >= 5) {
    throw new AuthError("Maximum verification attempts exceeded", 429);
  }

  // Verify OTP
  const isValidOtp = await argon2.verify(otpRecord.otpHash, otp);

  if (!isValidOtp) {
    otpRecord.attempts += 1;

    if (otpRecord.attempts >= 5) {
      otpRecord.lockedUntil = Date.now() + 15 * 60 * 1000;

      await prisma.securityEvent.create({
        data: {
          type: "OTP_BRUTE_FORCE",
          ipAddress,
          userAgent,
          metadata: {
            email,
            attempts: otpRecord.attempts,
          },
        },
      });
    }

    await redis.set(otpKey, JSON.stringify(otpRecord), "EX", 15 * 60);

    throw new AuthError("Invalid OTP", 400);
  }

  // Create user
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: pending.email,
        passwordHash: pending.passwordHash,
        emailVerifiedAt: new Date(),
        onboardingCompleted: false,
        status: "ACTIVE",
      },
    });

    await tx.pendingRegistration.delete({
      where: {
        id: pending.id,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "EMAIL_VERIFIED",
        ipAddress,
        userAgent,
        metadata: {
          email: user.email,
          verifiedAt: new Date().toISOString(),
        },
      },
    });

    return user;
  });

  // Delete OTP after success
  await redis.del(otpKey);

  return {
    success: true,
    message: "Email verified successfully",
    userId: createdUser.id,
  };
}
