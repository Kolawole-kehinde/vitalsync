import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { SESSION_TTL_SECONDS } from "@/src/constants/auth.constants";

export async function updateSessionActivity(sessionId: string, userId: string) {
  const now = new Date();

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      lastActivityAt: now,
    },
  });

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
