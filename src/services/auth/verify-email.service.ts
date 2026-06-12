import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import argon2 from "argon2";





type VerifyEmailData = {
  email: string;
  otp: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function verifyEmail(data: VerifyEmailData) {
  const {email, otp, ipAddress, userAgent,} = data;

  // 1. Find pending registration
  const pending =
    await prisma.pendingRegistration.findUnique({
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

  // 2. Find latest OTP
  const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        purpose:
          "EMAIL_VERIFICATION",
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!otpRecord) {
    throw new AuthError(
      "OTP not found",
      404
    );
  }

  // 3. Check expiry

  if (otpRecord.expiresAt < new Date()) {
    throw new AuthError(
      "OTP has expired",
      400
    );
  }

  // 4. Check attempts

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    throw new AuthError(
      "Maximum verification attempts exceeded",
      429
    );
  }

  // 5. Verify OTP

  const isValidOtp =
    await argon2.verify(
      otpRecord.otpHash,
      otp
    );

  if (!isValidOtp) { await prisma.otpCode.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new AuthError(
      "Invalid OTP",
      400
    );
  }

  // 6. Complete registration

  const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
              email:pending.email,
              passwordHash:pending.passwordHash,
              emailVerifiedAt:new Date(),
              onboardingCompleted:false,
              status: "ACTIVE",
            },
          });

        // Mark current OTP used

        await tx.otpCode.update({
          where: {
            id: otpRecord.id,
          },
          data: {
            usedAt: new Date(),
          },
        });

        // Delete all verification OTPs
        // for this email

        await tx.otpCode.deleteMany({
          where: {
            email,
            purpose:
              "EMAIL_VERIFICATION",
          },
        });

        // Remove pending registration

        await tx.pendingRegistration.delete({
          where: {
            id: pending.id,
          },
        });

        // Audit log

        await tx.auditLog.create({
          data: {
            userId: user.id,
            action:"EMAIL_VERIFIED",
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

  return {
    success: true,
    message: "Email verified successfully",
    userId: user.id,
  };
}