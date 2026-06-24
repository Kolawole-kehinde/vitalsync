import { FORGET_PASSWORD_EMAIL_LIMIT, FORGET_PASSWORD_EMAIL_WINDOW_SECONDS } from "@/src/constants/rate-limit.constants";
import { AuthError } from "@/src/lib/errors";
import { rateLimit } from "@/src/lib/rate-limit";

type ForgetPasswordLimitData ={
    ipAddress: string,
    email: string,
}

export async function checkForgetPasswordRateLimit(data: ForgetPasswordLimitData){
    const ip = data.ipAddress ?? "unknown";

    //IP PROTECTION
const ipResult = await rateLimit({
    key: `rate_limit:forgetPassword:${ip}`,
    limit: FORGET_PASSWORD_EMAIL_LIMIT,
    windowSeconds: FORGET_PASSWORD_EMAIL_WINDOW_SECONDS,

})

if(!ipResult.allowed){
 throw new AuthError(
    "Too many attempts, try again later",
    429
 )
}

// EMAIL PROTECTION
const emailResult = await rateLimit({
    key: `rate_limit:forgetPassword:${data.email}`,
    limit: FORGET_PASSWORD_EMAIL_LIMIT,
    windowSeconds: FORGET_PASSWORD_EMAIL_WINDOW_SECONDS,
})

if(!emailResult.allowed){
  throw new AuthError(
    "Too many attempts, try again later",
    429,
  )
}
}