import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { SESSION_TTL_SECONDS } from "@/src/constants/auth.constants";

export async function updateSessionActivity(sessionId: string, userId: string) {
  const now = new Date();

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session || !session.isActive) {
    return;
  }

  await redis.set(
    `session:${sessionId}`,
    JSON.stringify({
      sessionId,
      userId,
      lastActivityAt: now.getTime(),
    }),
    "EX",
    SESSION_TTL_SECONDS,
  );
}
