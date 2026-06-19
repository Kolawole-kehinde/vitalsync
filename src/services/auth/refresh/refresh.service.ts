import { generateAccessToken } from "../login/generate-access-token";

import { verifyRefreshToken } from "./verify-refresh-token";
import { rotateRefreshToken } from "./rotate-refresh-token";

export async function refreshSession(refreshToken: string) {
  const session = await verifyRefreshToken(
      refreshToken
    );

  const newRefreshToken = await rotateRefreshToken(
      session.id
    );

  const accessToken = await generateAccessToken({
      sub: session.user.id,
      sessionId: session.id,
      role: session.user.role,
    });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    sessionId: session.id,
  };
}