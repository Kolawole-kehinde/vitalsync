import { User } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";

export async function unlockUserIfExpired(gituser: User
) {
  if (
    user.status === "LOCKED" &&
    user.lockedUntil &&
    user.lockedUntil <= new Date()
  ) {
    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: "ACTIVE",
        lockedUntil: null,
      },
    });
  }

  return user;
}