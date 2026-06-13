import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import argon2 from "argon2";

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

export async function verifyEmail( data: VerifyEmailData) {
  const {email, otp, ipAddress, userAgent,} = data;

 
  // 1. Global IP protection

  const ipKey = `otp-ip-attempts:${ipAddress}`;

  const currentAttempts = await redis.incr(ipKey);

  if (currentAttempts === 1) {
    await redis.expire(
      ipKey,
      60 * 60
    );
  }

  if (currentAttempts > 20) {
    throw new AuthError(
      "Too many verification attempts. Try again later.",
      429
    );
  }


  // 2. Find pending registration

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
      throw new AuthError(
        "Email already verified",
        409
      );
    }

    throw new AuthError(
      "Registration not found",
      404
    );
  }


  // 3. Get OTP from Redis

  const otpData = await redis.get( `otp:email-verification:${email}`);

  if (!otpData) {
    throw new AuthError(
      "OTP not found or expired",
      404
    );
  }

  const otpRecord = JSON.parse(otpData) as RedisOtpRecord;


  // 4. Check lock

  if (otpRecord.lockedUntil && otpRecord.lockedUntil >  Date.now()) {
    throw new AuthError(
      "Verification temporarily locked. Request a new code or try again later.",
      429
    );
  }

  // 5. Check attempts

  if (otpRecord.attempts >= 5) {
    throw new AuthError(
      "Maximum verification attempts exceeded",
      429
    );
  }


  // 6. Verify OTP

  const isValidOtp = await argon2.verify(
      otpRecord.otpHash,
      otp
    );

   if (!isValidOtp) {
  otpRecord.attempts += 1;

  if (otpRecord.attempts >= 5) {
    otpRecord.lockedUntil =
      Date.now() + 15 * 60 * 1000;

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

  await redis.set(
    `otp:email-verification:${email}`,
    JSON.stringify(otpRecord),
    "EX",
    15 * 60
  );

  throw new AuthError(
    "Invalid OTP",
    400
  );
}

 
  // 7. Create User

  const user =
    await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.create({
            data: {
              email: pending.email,
              passwordHash: pending.passwordHash,
              emailVerifiedAt: new Date(),
              onboardingCompleted:false,
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
              email:
                user.email,
              verifiedAt:
                new Date().toISOString(),
            },
          },
        });

        return user;
      }
    );

  // 8. Remove OTP from Redis

  await redis.del(
    `otp:email-verification:${email}`
  );

  // 9. Success
 

  return {
    success: true,
    message: "Email verified successfully",
    userId: user.id,
  };
}