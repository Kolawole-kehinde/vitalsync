import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";
import { DUMMY_HASH } from "@/src/constants/auth.constants";
import { unlockUserIfExpired } from "./unlock-user";

type ValidateUserData = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function validateUser(data: ValidateUserData) {
 
  // Find User

  const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });


  // Timing Attack Protection

  if (!existingUser) {
    await argon2
      .verify(
        DUMMY_HASH,
        data.password
      )
      .catch(() => null);

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


  // Auto Unlock Expired Lock

  const user =
    await unlockUserIfExpired(
      existingUser
    );

 
  // Email Verification
 
  if (!user.emailVerifiedAt) {
    throw new AuthError(
      "Please verify your email before logging in.",
      403
    );
  }


  // Active Temporary Lock

  if (
    user.lockedUntil &&
    user.lockedUntil > new Date()
  ) {
    throw new AuthError(
      "Account temporarily locked. Try again later.",
      423
    );
  }

  // Account Status
  
  if (user.status !== "ACTIVE") {
    switch (user.status) {
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

      case "PENDING_VERIFICATION":
        throw new AuthError(
          "Please verify your email.",
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