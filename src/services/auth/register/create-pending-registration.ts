import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";

/*

hash password
create pending registration
audit log

*/

type CreatePendingRegistrationData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function createPendingRegistration(
  data: CreatePendingRegistrationData
) {
  const passwordHash =
    await argon2.hash(
      data.password
    );

  const expiresAt =
    new Date(
      Date.now() +
        15 * 60 * 1000
    );

  return prisma.$transaction(
    async (tx) => {
      const pending =
        await tx.pendingRegistration.create({
          data: {
            email: data.email,
            passwordHash,
            expiresAt,
            ipAddress:
              data.ipAddress,
            userAgent:
              data.userAgent,
          },
        });

      await tx.auditLog.create({
        data: {
          action:
            "REGISTRATION_INITIATED",
          ipAddress:
            data.ipAddress,
          userAgent:
            data.userAgent,
          metadata: {
            email:
              data.email,
          },
        },
      });

      return pending;
    }
  );
}