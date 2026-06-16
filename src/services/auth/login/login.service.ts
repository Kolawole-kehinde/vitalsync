import { AuthError } from "@/src/lib/errors";

import { validateUser } from "./validate-user";
import { verifyPassword } from "./verify-password";
import { handleFailedLogin } from "./handle-failed-login";
import { handleSuccessfulLogin } from "./handle-successful-login";
import { createSession } from "./create-session";

import { LoginData } from "./types";

export async function loginService(
  data: LoginData
) {
  const email =
    data.email.trim().toLowerCase();

  const user =
    await validateUser({
      email,
      password: data.password,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

  const isValidPassword =
    await verifyPassword({
      passwordHash: user.passwordHash,
      password: data.password,
    });

  if (!isValidPassword) {
    await handleFailedLogin({
      user,
      email,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    throw new AuthError(
      "Invalid credentials",
      401
    );
  }

  await handleSuccessfulLogin({
    user,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });

  const session = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    session,
  };
}