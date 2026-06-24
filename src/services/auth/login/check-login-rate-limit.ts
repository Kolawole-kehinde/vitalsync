import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

import {
  LOGIN_LIMIT,
  LOGIN_WINDOW_SECONDS,
} from "@/src/constants/rate-limit.constants";

export async function checkLoginRateLimit(email: string, ipAddress?: string) {
  const ip = ipAddress ?? "unknown";

  const [ipResult, emailResult] = await Promise.all([
    rateLimit({
      key: `rate_limit:login:${ip}`,
      limit: LOGIN_LIMIT,
      windowSeconds: LOGIN_WINDOW_SECONDS,
    }),

    rateLimit({
      key: `rate_limit:login_email:${email}`,
      limit: LOGIN_LIMIT,
      windowSeconds: LOGIN_WINDOW_SECONDS,
    }),
  ]);

  if (!ipResult.allowed) {
    throw new AuthError(
      "Too many login attempts from this IP. Try again later.",
      429,
    );
  }

  if (!emailResult.allowed) {
    throw new AuthError(
      "Too many login attempts for this account. Try again later.",
      429,
    );
  }
}
