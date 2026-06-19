import { prisma } from "@/src/lib/prisma";
import { hashRefreshToken } from "./hash-refresh-token";
import { generateRefreshToken } from "./generate-refresh-token";


export async function rotateRefreshToken(sessionId: string) {
  const {token: refreshToken,secret,} = generateRefreshToken(
    sessionId
  );

  const refreshTokenHash = await hashRefreshToken(
      secret
    );

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      refreshTokenHash,
      lastActivityAt:
        new Date(),
    },
  });

  return refreshToken;
}