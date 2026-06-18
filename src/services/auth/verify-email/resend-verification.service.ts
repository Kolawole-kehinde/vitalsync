import argon2 from "argon2";

import { AuthError } from "@/src/lib/errors";
import { generateOTP } from "@/src/lib/otp";
import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { emailQueue } from "@/src/lib/queue";
import { checkOtpResendRateLimit } from "./check-otp-resend-rate-limit";

type ResendVerificationData = {
  email: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function resendVerificationEmail( data: ResendVerificationData) {
 const email = data.email.trim().toLowerCase();

  const { ipAddress, userAgent,} = data;

  await checkOtpResendRateLimit(email);


  // 1. Registration must exist

  const pending = await prisma.pendingRegistration.findUnique({
      where: {
        email,
      },
    });

  if (!pending) {
    throw new AuthError(
      "Registration not found",
      404
    );
  }


  // 2. Cooldown

  const cooldownKey = `otp-resend-cooldown:${email}`;
  const cooldownExists = await redis.exists(cooldownKey);

  if (cooldownExists) {
    throw new AuthError(
      "Please wait before requesting another code",
      429
    );
  }

  // 3. Hourly limit

  const countKey = `otp-resend-count:${email}`;
  const resendCount =  await redis.incr(countKey);
  if (resendCount === 1) {
    await redis.expire(
      countKey,
      60 * 60
    );
  }

  if (resendCount > 5) {
    await prisma.securityEvent.create({
      data: {
        type: "OTP_RESEND_ABUSE",
        ipAddress,
        userAgent,
        metadata: {
          email,
          resendCount,
        },
      },
    });

    throw new AuthError(
      "Maximum OTP requests reached",
      429
    );
  }

  // 4. Create cooldown

  await redis.set(cooldownKey,"1", "EX", 60);

  // 5. Generate OTP

  const otp = generateOTP();
  const otpHash = await argon2.hash(otp);


  // 6. Replace old OTP

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

  // 7. Queue Email

  await emailQueue.add(
    "send-verification-email",
    {
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

  // 8. Audit Log

  await prisma.auditLog.create({
    data: {
      action:
        "VERIFICATION_EMAIL_RESENT",
      ipAddress,
      userAgent,
      metadata: {
        email,
        resendCount,
      },
    },
  });

  return {
    success: true,
    message:
      "Verification code sent",
  };
}