import { AuthError } from "@/src/lib/errors";
import { generateOTP } from "@/src/lib/otp";
import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { emailQueue } from "@/src/lib/queue";
import argon2 from "argon2";

type RegisterData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function registerUser(data: RegisterData) {
  const {email,password,ipAddress,userAgent,} = data;

  // 1. Check existing user

  const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new AuthError(
       "Please check your email.",
      409
    );
  }

  // 2. Check pending registration

  const existingPending =
    await prisma.pendingRegistration.findUnique({
      where: {
        email,
      },
    });

  if (existingPending) {
    throw new AuthError(
      "Verification already pending",
      409
    );
  }

  // 3. Hash password

  const passwordHash =
    await argon2.hash(password);

  // 4. Generate OTP

  const otp = generateOTP();

  // 5. Hash OTP

  const otpHash = await argon2.hash(otp);

  // 6. OTP expiry

  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000
  );

  // 7. Store OTP in Redis

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

  // 8. Create pending registration

  const pending = await prisma.$transaction(
      async (tx) => {
        const pending =
          await tx.pendingRegistration.create({
            data: {
              email,
              passwordHash,
              expiresAt,
              ipAddress,
              userAgent,
            },
          });

        await tx.auditLog.create({
          data: {
            action:
              "REGISTRATION_INITIATED",
            ipAddress,
            userAgent,
            metadata: {
              email,
            },
          },
        });

        return pending;
      }
    );

  // 9. Queue email

  await emailQueue.add("send-verification-email", {
      email,
      otp,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: 100,
      removeOnFail: 1000,
    }
  );

  // 10. Response

  return {
    success: true,
    message: "Verification code sent",
    pendingId: pending.id,
  };
}