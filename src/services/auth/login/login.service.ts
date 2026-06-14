
import { AuthError } from "@/src/lib/errors";
import { validateUser } from "./validate-user";
import { handleFailedLogin } from "./handle-failed-login";
import { verifyPassword } from "./verify-password";
import { handleSuccessfulLogin } from "./handle-successful-login";
import { LoginData } from "./types";



export async function loginService(data: LoginData) {
  const email = data.email.trim().toLowerCase();

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
      password: data.password
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

 

  return await handleSuccessfulLogin({
    user,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });
}