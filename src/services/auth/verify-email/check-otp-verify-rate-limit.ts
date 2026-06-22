import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

export async function checkOtpVerifyRateLimit(
  email: string,
  ipAddress?: string
) {
  // Email limit
  const emailResult = await rateLimit({
    key: `rate_limit:otp_verify:${email}`,
    limit: 10,
    windowSeconds: 15 * 60,
  });

  if (!emailResult.allowed) {
    throw new AuthError(
      "Too many verification attempts. Try again later.",
      429
    );
  }

  // IP limit
  const ip = ipAddress ?? "unknown";

  const ipResult = await rateLimit({
    key: `rate_limit:otp_verify_ip:${ip}`,
    limit: 50,
    windowSeconds: 60 * 60,
  });

  if (!ipResult.allowed) {
    throw new AuthError(
      "Too many verification attempts from this IP. Try again later.",
      429
    );
  }
}