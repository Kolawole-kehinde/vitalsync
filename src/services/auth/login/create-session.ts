import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";

import { generateAccessToken } from "./generate-access-token";
import { generateRefreshToken } from "./generate-refresh-token";
import { hashRefreshToken } from "./hash-refresh-token";

import type {
  SessionData,
  CreateSessionResult,
} from "./types";

export async function createSession(data: SessionData): Promise<CreateSessionResult> {
 
  // Generate Refresh Token
 
  const refreshToken = generateRefreshToken();

  const refreshTokenHash = await hashRefreshToken(refreshToken);

 
  // Create Session Record
 
  const session = await prisma.session.create({
      data: {
        userId: data.userId,
        refreshTokenHash,
        deviceName: data.deviceName,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        country: data.country,
        city: data.city,

        expiresAt: new Date(
          Date.now() +
            30 *
              24 *
              60 *
              60 *
              1000
        ),
      },
    });


  // Store Session In Redis
  await redis.set(
    `session:${session.id}`,
    JSON.stringify({
      sessionId: session.id,
      userId: data.userId,
      email: data.email,
      role: data.role,
      device: data.deviceName,
      ip: data.ipAddress,
      country: data.country,
      city: data.city,
      createdAt: session.createdAt,
    }),
    "EX",
    30 * 24 * 60 * 60
  );


  // Generate Access Token

  const accessToken = await generateAccessToken({
      sub: data.userId,
      sid: session.id,
      role: data.role,
    });

  // Return Tokens
  return {
    sessionId: session.id,
    accessToken,
    refreshToken,
  };
}