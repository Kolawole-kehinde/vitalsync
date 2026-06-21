import { prisma } from "@/src/lib/prisma";

export async function getUserSessions(userId: string, currentSessionId: string) {

  const sessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        deviceName: true,
        ipAddress: true,
        country: true,
        city: true,
        createdAt: true,
        lastActivityAt: true,
      },
    });

  return sessions.map(
    (session) => ({
      ...session,
      isCurrent:
        session.id ===
        currentSessionId,
    })
  );
}