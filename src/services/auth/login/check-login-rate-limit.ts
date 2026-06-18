import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

import {LOGIN_LIMIT, LOGIN_WINDOW_SECONDS} from "@/src/constants/rate-limit.constants";

export async function checkLoginRateLimit( ipAddress?: string) {
  const ip =  ipAddress ?? "unknown";

  const result = await rateLimit({
      key: `rate_limit:login:${ip}`,
      limit:LOGIN_LIMIT,
      windowSeconds: LOGIN_WINDOW_SECONDS,
    });

  if (!result.allowed) {
    throw new AuthError(
      "Too many login attempts. Try again later.",
      429
    );
  }
}