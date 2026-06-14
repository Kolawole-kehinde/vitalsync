import argon2 from "argon2";

import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";

type LoginData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function loginService(
  data: LoginData
) {
 
  // Normalize Email
 
  const email = data.email.trim().toLowerCase();


  // Find User


  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!existingUser) {
    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  // Email Verification Check

  if (!existingUser.emailVerifiedAt) {
    throw new AuthError(
      "Please verify your email before logging in.",
      403
    );
  }


  // Temporary Lock Check

  if (
    existingUser.lockedUntil &&
    existingUser.lockedUntil > new Date()
  ) {
    throw new AuthError(
      "Account temporarily locked. Try again later.",
      423
    );
  }


  // Account Status Check
 
  if (existingUser.status !== "ACTIVE") {
    switch (existingUser.status) {
      case "PENDING_VERIFICATION":
        throw new AuthError(
          "Please verify your email before logging in.",
          403
        );

      case "LOCKED":
        throw new AuthError(
          "Account locked. Contact support.",
          423
        );

      case "SUSPENDED":
        throw new AuthError(
          "Account suspended. Contact support.",
          403
        );

      case "DELETED":
        throw new AuthError(
          "Account unavailable.",
          403
        );

      default:
        throw new AuthError(
          "Account unavailable.",
          403
        );
    }
  }


  // Verify Password


  const isValidPassword = await argon2.verify(
      existingUser.passwordHash,
      data.password
    );


  // Wrong Password
 
  if (!isValidPassword) {
    const updatedUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          failedLoginAttempts: {
            increment: 1,
          },
        },
      });

  
    // Lock Account After 5 Failures

    if (updatedUser.failedLoginAttempts >= 5) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          status: "ACTIVE",
          lockedUntil: new Date(
            Date.now() +
              15 * 60 * 1000
          ),
        },
      });

      await prisma.securityEvent.create({
        data: {
          userId: existingUser.id,
          type: "MULTIPLE_FAILED_LOGINS",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: {
            failedAttempts:
              updatedUser.failedLoginAttempts,
          },
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: existingUser.id,
        action: "LOGIN_FAILED",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  // Successful Login

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      status: "ACTIVE",
      lastLoginAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: existingUser.id,
      action: "LOGIN_SUCCESS",
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });

  return {
    success: true,
    user: {
      id: existingUser.id,
      email: existingUser.email,
      status: existingUser.status,
    },
  };
}