import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";
import { DUMMY_HASH } from "@/src/constants/auth.constants";

type ValidateUserData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function validateUser(data: ValidateUserData) {
  const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (!user) {
    await argon2.verify(DUMMY_HASH,data.password).catch(() => null);

    await prisma.loginAttempt.create({
      data: {
        email: data.email,
        success: false,
        failureReason:
          "INVALID_CREDENTIALS",
        ipAddress:
          data.ipAddress,
        userAgent:
          data.userAgent,
      },
    });

    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  if (!user.emailVerifiedAt) {
    throw new AuthError(
      "Please verify your email before logging in.",
      403
    );
  }

  if (
    user.lockedUntil &&
    user.lockedUntil >
      new Date()
  ) {
    throw new AuthError(
      "Account temporarily locked. Try again later.",
      423
    );
  }

   if (existingUser.status !== "ACTIVE") {
    switch (
      existingUser.status
    ) {
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


  return user;
}