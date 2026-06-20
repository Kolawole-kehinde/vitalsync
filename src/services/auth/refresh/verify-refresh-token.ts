import argon2 from "argon2";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";

export async function verifyRefreshToken(refreshToken: string) {
  const parts = refreshToken.split(".");

  if (parts.length !== 2) {
    throw new AuthError("Invalid refresh token", 401);
  }

  const [sessionId, secret] = parts;

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    throw new AuthError("Session not found", 401);
  }

  if (!session.isActive) {
    throw new AuthError("Session revoked", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AuthError("Session expired", 401);
  }

  const isValid = await argon2.verify(session.refreshTokenHash, secret);

  if (!isValid) {
    throw new AuthError("Invalid refresh token", 401);
  }

  return session;
}
