import crypto from "crypto";

export function generateRefreshToken(sessionId: string) {
  const bytes = Number(process.env.REFRESH_TOKEN_BYTES ?? 64
  );

  const secret = crypto.randomBytes(bytes) .toString("hex");

  return {
    token:`${sessionId}.${secret}`,
    secret,
  };
}