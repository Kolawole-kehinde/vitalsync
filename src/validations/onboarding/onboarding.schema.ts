import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),

  dateOfBirth: z
  .coerce.date({
    error: "Invalid date of birth",
  })
  .refine((date) => {
    const today = new Date();

    let age =
      today.getFullYear() - date.getFullYear();

    const monthDifference =
      today.getMonth() - date.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < date.getDate())
    ) {
      age--;
    }

    return age >= 13 && age <= 120;
  }, "Age must be between 13 and 120 years"),

  gender: z.enum(
    ["MALE", "FEMALE", "OTHER"],
    {
      error: "Invalid gender",
    }
  ),

  height: z
    .number({
      error: "Height must be a number",
    })
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height cannot exceed 300 cm"),

  weight: z
    .number({
      error: "Weight must be a number",
    })
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight cannot exceed 500 kg"),

  activityLevel: z.enum(
    [
      "SEDENTARY",
      "LIGHTLY_ACTIVE",
      "MODERATELY_ACTIVE",
      "VERY_ACTIVE",
      "ATHLETE",
    ],
    {
      error: "Invalid activity level",
    }
  ),

  primaryGoal: z.enum(
    [
      "LOSE_WEIGHT",
      "MAINTAIN_WEIGHT",
      "GAIN_WEIGHT",
      "BUILD_MUSCLE",
      "IMPROVE_FITNESS",
      "IMPROVE_SLEEP",
      "GENERAL_WELLNESS",
    ],
    {
      error: "Invalid primary goal",
    }
  ),

  preferredUnit: z.enum(
    ["METRIC", "IMPERIAL"],
    {
      error: "Invalid preferred unit",
    }
  ),
});

export type OnboardingInput = z.infer<
  typeof onboardingSchema
>;