import crypto from "crypto";

export function generateRefreshToken() {
  const bytes = Number(
 process.env.REFRESH_TOKEN_BYTES ?? 64
  );

  return crypto.randomBytes(bytes).toString("hex");
}