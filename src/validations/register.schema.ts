import { z } from "zod";
import { passwordSchema } from "../lib/password-schema";

export const registerSchema = z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
