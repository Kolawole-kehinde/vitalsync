import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";

export async function verifyResetToken(resetToken: string) {
  const resetRecords = await prisma.passwordReset.findMany({
    where: {
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  for (const record of resetRecords) {
    const valid = await argon2.verify(record.tokenHash, resetToken);

if (valid) {
  return {
    passwordReset: record,
    user: record.user,
  };
};
  }

  throw new AuthError("Invalid or expired reset token", 400);
}
