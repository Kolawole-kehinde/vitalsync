

import { checkEmailAbuse } from "./check-email-abuse";
import { checkRegisterRateLimit } from "./check-register-rate-limit";
import { createPendingRegistration } from "./create-pending-registration";
import { createVerificationOtp } from "./create-verification-otp";
import { queueVerificationEmail } from "./queue-verification-email";
import { validateRegistration } from "./register-user-checks";
import { RegisterData } from "./types";

export async function registerUser(data: RegisterData) {
  
 await checkRegisterRateLimit(data.ipAddress);
 

 const email = data.email.trim().toLowerCase();

  await  checkEmailAbuse(data.email);

  await validateRegistration( email);

  const pending = await createPendingRegistration({
      ...data,
      email,
    });

  const otp = await createVerificationOtp(
      email
    );

  await queueVerificationEmail(
    email,
    otp
  );

  return {
    success: true,
    message: "Verification code sent",
    pendingId: pending.id,
  };
}