import { prisma } from "@/src/lib/prisma";

import { resetLoginAttempts,} from "@/src/lib/login-attempts";

type SuccessfulLoginData = {
  user: {
    id: string;
    email: string;
  };
  ipAddress?: string;
  userAgent?: string;
};

export async function handleSuccessfulLogin(data: SuccessfulLoginData) {

  await resetLoginAttempts(data.user.email);
  
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id: data.user.id,
      },
      data: {
        status: "ACTIVE",
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    await tx.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        success: true,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_SUCCESS",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  });
}