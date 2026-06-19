import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { generateAccessToken } from "./generate-access-token";
import type { SessionData, CreateSessionResult } from "./types";
import {
  SESSION_TTL_MS,
  SESSION_TTL_SECONDS,
} from "@/src/constants/auth.constants";
import { createId } from "@paralleldrive/cuid2";
import { generateRefreshToken } from "../refresh/generate-refresh-token";
import { hashRefreshToken } from "../refresh/hash-refresh-token";

export async function createSession(data: SessionData,
): Promise<CreateSessionResult> {


  const sessionId = createId();
  // Generate Refresh Token

const {
  token: refreshToken,
  secret,
} = generateRefreshToken(
  sessionId
);

const refreshTokenHash =
  await hashRefreshToken(secret);

  // Create Session Record

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId: data.userId,
      refreshTokenHash,
      deviceName: data.deviceName,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      country: data.country,
      city: data.city,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  await redis.set(
    `session:${session.id}`,
    JSON.stringify({
      sessionId: session.id,
      userId: data.userId,
      lastActivityAt: Date.now(),
    }),
    "EX",
    SESSION_TTL_SECONDS,
  );


  // Generate Access Token
  const accessToken = await generateAccessToken({
    sub: data.userId,
    sessionId: session.id,
    role: data.role,
  });

  // Return Tokens
  return {
    sessionId: session.id,
    accessToken,
    refreshToken,
  };
}
