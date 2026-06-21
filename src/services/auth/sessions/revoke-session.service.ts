import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { AuthError } from "@/src/lib/errors";

type RevokeSessionData = {
  userId: string;
  sessionId: string;
  currentSessionId: string;
};

export async function revokeSession(data: RevokeSessionData) {
  const { userId, sessionId, currentSessionId } = data;

  if (sessionId === currentSessionId) {
    throw new AuthError(
        "Use logout endpoint for current session", 
        400
    );
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    throw new AuthError("Session not found", 404);
  }

  if (session.userId !== userId) {
    throw new AuthError("Unauthorized", 403);
  }

  if (!session.isActive) {
    throw new AuthError("Session already revoked", 400);
  }

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      isActive: false,
      revokedAt: new Date(),
      revokedReason: "USER_REVOKED",
    },
  });

  await redis.del(`session:${sessionId}`);

  return {
    success: true,
  };
}
