import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";


/*
existingUser check
existingPending check
throw AuthError
*/

export async function validateRegistration(email: string) {
  const existingUser = await prisma.user.findUnique({
      where: { email },
    });

  if (existingUser) {
    throw new AuthError(
      "Please check your email.",
      409
    );
  }

  const existingPending = await prisma.pendingRegistration.findUnique({
      where: { email },
    });

  if (existingPending) {
    throw new AuthError(
      "Verification already pending",
      409
    );
  }
}