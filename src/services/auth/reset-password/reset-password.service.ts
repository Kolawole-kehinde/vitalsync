import { prisma } from "@/src/lib/prisma";
import argon2 from "argon2";
import { checkResetPasswordRateLimit } from "./check-reset-password-rate-limit";
import { verifyResetToken } from "./verify-reset-token";
import { queuePasswordChangedEmail } from "./queue-password-changed-email";

type ResetPasswordData = {
  resetToken: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function resetPasswordService(data: ResetPasswordData) {
  await checkResetPasswordRateLimit({
    ipAddress: data.ipAddress,
  });

  const { passwordReset, user } = await verifyResetToken(data.resetToken);

  const passwordHash = await argon2.hash(data.password);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    await tx.passwordReset.update({
      where: {
        id: passwordReset.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await tx.session.updateMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: "PASSWORD_CHANGED",
      },
    });

    await tx.securityEvent.create({
      data: {
        type: "PASSWORD_CHANGED",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: {
          email: user.email,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_CHANGED",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: {
          email: user.email,
        },
      },
    });
  });

  await queuePasswordChangedEmail({
    email: user.email,
  });

  return {
    success: true,
    message: "Password reset successful. Please login again.",
  };
}
