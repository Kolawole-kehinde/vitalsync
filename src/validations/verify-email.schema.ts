import { z } from "zod";

export const verifyEmailSchema = z.object({
  email: z.email().toLowerCase().trim(),

  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
