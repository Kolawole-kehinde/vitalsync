import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

export async function checkOtpResendRateLimit(
  email: string,
  ipAddress?: string
) {
  // Email limit
  const emailResult = await rateLimit({
    key: `rate_limit:otp_resend:${email}`,
    limit: 2,
    windowSeconds: 15 * 60,
  });

  if (!emailResult.allowed) {
    throw new AuthError(
      "Too many OTP requests for this email. Try again later.",
      429
    );
  }

  // IP limit
  const ip = ipAddress ?? "unknown";

  const ipResult = await rateLimit({
    key: `rate_limit:otp_resend_ip:${ip}`,
    limit: 20,
    windowSeconds: 60 * 60,
  });

  if (!ipResult.allowed) {
    throw new AuthError(
      "Too many OTP requests from this IP. Try again later.",
      429
    );
  }
}