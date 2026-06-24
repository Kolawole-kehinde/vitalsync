import { z } from "zod";
import { passwordSchema } from "../lib/password-schema";

export const loginSchema = z
  .object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: passwordSchema
  });

export type LoginInput = z.infer<typeof loginSchema>;
