import { cookies } from "next/headers";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";
import { ACCESS_TOKEN_COOKIE } from "@/src/constants/cookie.constants";

import { verifyAccessToken } from "./verify-access-token";
import { updateSessionActivity } from "../sessions/update-session-activity";

export async function getAuthUser() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    throw new AuthError("Unauthorized", 401);
  }

  const payload = await verifyAccessToken(accessToken);

  // Update current session activity
  await updateSessionActivity(
    payload.sessionId,
    payload.sub
  );

  // Fetch authenticated user
  const user = await prisma.user.findUnique({
    where: {
      id: payload.sub,
    },
    include: {
      profile: true,
      wellnessPreferences: true,
    },
  });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  // Fetch current session
  const session = await prisma.session.findUnique({
    where: {
      id: payload.sessionId,
    },
    select: {
      lastActivityAt: true,
      expiresAt: true,
    },
  });

  return {
    user,
    session,
    sessionId: payload.sessionId,
  };
}