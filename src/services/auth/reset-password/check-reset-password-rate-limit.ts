import {
RESET_PASSWORD_LIMIT,
RESET_PASSWORD_WINDOW_SECONDS,
} from "@/src/constants/rate-limit.constants";

import { rateLimit } from "@/src/lib/rate-limit";
import { AuthError } from "@/src/lib/errors";

type ResetPasswordRateLimitData = {
ipAddress?: string;
};

export async function checkResetPasswordRateLimit(data: ResetPasswordRateLimitData) {
const ip = data.ipAddress ?? "unknown";

const result = await rateLimit({
         key: `rate_limit:reset_password:${ip}`,
        limit: RESET_PASSWORD_LIMIT,
        windowSeconds: RESET_PASSWORD_WINDOW_SECONDS,
});

if (!result.allowed) {
throw new AuthError(
"Too many password reset attempts. Try again later.",
429
);
}
}
