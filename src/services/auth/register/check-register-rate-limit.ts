import { AuthError } from "@/src/lib/errors";

import { rateLimit } from "@/src/lib/rate-limit";

import {REGISTER_LIMIT, REGISTER_WINDOW_SECONDS,} from "@/src/constants/rate-limit.constants";

export async function checkRegisterRateLimit(ipAddress?: string) {
  const result =await rateLimit({
      key: `rate_limit:register:${ipAddress}`,
      limit: REGISTER_LIMIT,
      windowSeconds: REGISTER_WINDOW_SECONDS,
    });

  if (!result.allowed) {
    throw new AuthError(
      "Too many registrations. Try again later.",
      429
    );
  }
}