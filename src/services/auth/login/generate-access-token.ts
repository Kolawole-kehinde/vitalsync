import { SignJWT } from "jose";

import { AccessTokenPayload } from "./types";

export async function generateAccessToken(data: AccessTokenPayload) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not configured"
    );
  }

  const secretKey = new TextEncoder().encode(secret);

  return await new SignJWT({
    role: data.role,
  })
    .setSubject(data.sub)
    .setJti(data.sid)
    .setIssuedAt()
    .setIssuer("vitalsync")
    .setAudience("vitalsync-api")
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES_IN ??"15m"
    ).sign(secretKey);
}