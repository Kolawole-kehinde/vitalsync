import { SignJWT } from "jose";
import crypto from "crypto";
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
    sessionId: data.sessionId,
    role: data.role,
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(data.sub)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setIssuer("vitalsync")
    .setAudience("vitalsync-api")
    .setExpirationTime(
      process.env.ACCESS_TOKEN_EXPIRES_IN ??
        "15m"
    )
    .sign(secretKey);
}