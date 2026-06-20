import { jwtVerify } from "jose";

import type { AccessTokenPayload } from "./types";

export async function verifyAccessToken(token: string,): Promise<AccessTokenPayload> {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  const secretKey = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, secretKey, {
    issuer: "vitalsync",
    audience: "vitalsync-api",
  });

  return {
    sub: payload.sub as string,
    sessionId: payload.sessionId as string,
    role: payload.role as AccessTokenPayload["role"],
  };
}
