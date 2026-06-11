import { AuthError } from "@/src/lib/errors";
import { generateOTP } from "@/src/lib/otp";
import { prisma } from "@/src/lib/prisma";
import { emailQueue } from "@/src/lib/queue";
import argon2 from "argon2";



type RegisterData = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterData) {
  const { email, password } = data;

  // 1. Check actual user

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new AuthError(
      "Account already exists",
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
      "Verification already pending"
    );
  }

  // 3. Hash password

  const passwordHash =
    await argon2.hash(password);

  // 4. Generate OTP

  const otp = generateOTP();

  // 5. Hash OTP

  const otpHash =
    await argon2.hash(otp);

  // 6. Expiry

  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000
  );

  // 7. Create Pending Registration

  const pending =
    await prisma.pendingRegistration.create({
      data: {
        email,
        passwordHash,
        expiresAt,
      },
    });

  // 8. Create OTP

  await prisma.otpCode.create({
    data: {
      otpHash,
      purpose: "EMAIL_VERIFICATION",
      expiresAt,
    },
  });

  // 9. Audit Log

  await prisma.auditLog.create({
    data: {
      action:
        "REGISTRATION_INITIATED",
    },
  });

  // 10. Queue Email

  await emailQueue.add(
    "send-verification-email",
    {
      email,
      otp,
    }
  );

  return {
    success: true,
    message:
      "Verification code sent",
    pendingId: pending.id,
  };
}