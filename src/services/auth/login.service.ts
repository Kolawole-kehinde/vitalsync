import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";

type LoginData = {
  email: string;
  password: string;
};

export async function loginService(
  data: LoginData
) {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  // User not found
  if (!existingUser) {
    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  // Email not verified
  if (!existingUser.emailVerifiedAt) {
    throw new AuthError(
      "Please verify your email before logging in.",
      401
    );
  }

  // Account status checks
  if (existingUser.status !== "ACTIVE") {
    switch (existingUser.status) {
      case "LOCKED":
        throw new AuthError(
          "Account is locked.",
          423
        );

      case "SUSPENDED":
        throw new AuthError(
          "Account is suspended.",
          403
        );

      case "DELETED":
        throw new AuthError(
          "Account no longer exists.",
          403
        );

      default:
        throw new AuthError(
          "Account is not active.",
          403
        );
    }
  }

  // Temporary lock check
  if (
    existingUser.lockedUntil &&
    existingUser.lockedUntil > new Date()
  ) {
    throw new AuthError(
      "Account temporarily locked.",
      423
    );
  }

  // Verify password
  const isPasswordValid =
    await argon2.verify(
      existingUser.passwordHash,
      data.password
    );

  // Invalid password
  if (!isPasswordValid) {
    const failedAttempts = existingUser.failedLoginAttempts + 1;

const shouldLock = failedAttempts >= 5;
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        failedLoginAttempts:
          failedAttempts,

        ...(shouldLock && {
          lockedUntil: new Date(
            Date.now() +
              15 * 60 * 1000
          ),
        }),
      },
    });

    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  // Successful login
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  return {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      status: existingUser.status,
    },
  };
}