import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";
import {REGISTER_EMAIL_LIMIT, REGISTER_EMAIL_WINDOW_SECONDS,} from "@/src/constants/rate-limit.constants";


export async function checkEmailAbuse(email: string) {
  const result = await rateLimit({
      key: `rate_limit:register_email:${email}`,
      limit: REGISTER_EMAIL_LIMIT,
      windowSeconds: REGISTER_EMAIL_WINDOW_SECONDS,
    });

  if (!result.allowed) {
    throw new AuthError(
      "Too many attempts for this email. Try again later.",
      429
    );
  }
}