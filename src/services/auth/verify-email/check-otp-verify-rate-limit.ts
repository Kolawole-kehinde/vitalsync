import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

export async function checkOtpVerifyRateLimit(email: string){
  const result = await rateLimit({
     key: `rate_limit:otp_verify:${email}`,
     limit: 10,
     windowSeconds: 15 * 60
  })

  if(!result.allowed){
    throw new AuthError(
"Too many verification attempts. Try again later.",
      429
  )
  }
}