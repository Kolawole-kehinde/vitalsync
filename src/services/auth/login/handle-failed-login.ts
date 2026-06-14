import { prisma } from "@/src/lib/prisma";

import {
  incrementLoginAttempts,
} from "@/src/lib/login-attempts";

import {
  LOCK_DURATION_MS,
  MAX_LOGIN_ATTEMPTS,
} from "@/src/constants/auth.constants";

type FailedLoginData = {
  user: any;
  email: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function handleFailedLogin(data: FailedLoginData) {
  await prisma.$transaction(
    async (tx) => {
      const attempts =
        await incrementLoginAttempts(
          data.email
        );

      await tx.loginAttempt.create({
        data: {
          userId: data.user.id,
          email: data.email,
          success: false,
          failureReason:
            "INVALID_PASSWORD",
          ipAddress:
            data.ipAddress,
          userAgent:
            data.userAgent,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: data.user.id,
          action:
            "LOGIN_FAILED",
          ipAddress:
            data.ipAddress,
          userAgent:
            data.userAgent,
        },
      });

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_DURATION_MS
          );

        await tx.user.update({
          where: {
            id: data.user.id,
          },
          data: {
            status: "LOCKED",
            lockedUntil: lockUntil,
          },
        });

        await tx.securityEvent.create({
          data: {
            userId: data.user.id,
            type: "MULTIPLE_FAILED_LOGINS",
            ipAddress:  data.ipAddress,
            userAgent: data.userAgent,
          },
        });

        await tx.auditLog.create({
          data: {
            userId:
              data.user.id,
            action:
              "ACCOUNT_LOCKED",
          },
        });
      }
    }
  );
}