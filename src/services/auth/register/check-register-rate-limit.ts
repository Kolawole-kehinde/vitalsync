import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

import {
  REGISTER_LIMIT,
  REGISTER_WINDOW_SECONDS,
  REGISTER_EMAIL_LIMIT,
  REGISTER_EMAIL_WINDOW_SECONDS,
} from "@/src/constants/rate-limit.constants";

type RegisterRateLimitData = {
  email: string;
  ipAddress?: string;
};

export async function checkRegisterRateLimit(
  data: RegisterRateLimitData
) {
  const ip = data.ipAddress ?? "unknown";

  // IP protection
  const ipResult = await rateLimit({
    key: `rate_limit:register:${ip}`,
    limit: REGISTER_LIMIT,
    windowSeconds: REGISTER_WINDOW_SECONDS,
  });

  if (!ipResult.allowed) {
    throw new AuthError(
      "Too many registrations. Try again later.",
      429
    );
  }

  // Email protection
  const emailResult = await rateLimit({
    key: `rate_limit:register_email:${data.email}`,
    limit: REGISTER_EMAIL_LIMIT,
    windowSeconds: REGISTER_EMAIL_WINDOW_SECONDS,
  });

  if (!emailResult.allowed) {
    throw new AuthError(
      "Too many attempts for this email. Try again later.",
      429
    );
  }
}