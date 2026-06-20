import { cookies } from "next/headers";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";
import { ACCESS_TOKEN_COOKIE } from "@/src/constants/cookie.constants";
import { verifyAccessToken } from "./verify-access-token";




export async function getAuthUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    throw new AuthError("Unauthorized", 401);
  }

  const payload = await verifyAccessToken(accessToken);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.sub,
    },
  });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  return {
    user,
    sessionId: payload.sessionId,
  };
}
