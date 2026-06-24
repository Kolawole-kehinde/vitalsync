import { z } from "zod";
import { passwordSchema } from "../lib/password-schema";


export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  password: passwordSchema
});
