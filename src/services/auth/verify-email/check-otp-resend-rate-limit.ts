import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

export async function checkOtpResendRateLimit(email: string){
  const result = await rateLimit({
    key:`rate_limi:otp_resend:${email}`,
    limit: 3,
    windowSeconds: 15 * 60
  })
  if(!result.allowed){
    throw new AuthError(
       "Too many OTP requests. Try again later.",
        429
    )
  }
}