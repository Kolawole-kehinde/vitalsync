import { z } from "zod";

export const resendVerificationSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
