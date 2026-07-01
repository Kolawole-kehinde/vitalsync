import { OnboardingInput } from "@/src/validations/onboarding/onboarding.schema";

import { prisma } from "@/src/lib/prisma";
import { AuthError } from "@/src/lib/errors";

type OnboardingServiceData = {
  userId: string;
  ipAddress: string;
  userAgent: string;
} & OnboardingInput;

export async function onboardingService(data: OnboardingServiceData) {
  // Fetch user
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  // User must exist
  if (!user) {
    throw new AuthError("User not found", 404);
  }

  // Prevent onboarding twice
  if (user.onboardingCompleted) {
    throw new AuthError("Onboarding already completed", 400);
  }

  // Transaction
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
      },
    });

    const preferences = await tx.wellnessPreferences.create({
      data: {
        userId: data.userId,
        activityLevel: data.activityLevel,
        primaryGoal: data.primaryGoal,
        preferredUnit: data.preferredUnit,
      },
    });

    await tx.user.update({
      where: {
        id: data.userId,
      },
      data: {
        onboardingCompleted: true,
      },
    });

    await tx.securityEvent.create({
      data: {
        type: "ONBOARDING_COMPLETED",
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: {
          email: user.email,
          activityLevel: data.activityLevel,
          primaryGoal: data.primaryGoal,
          preferredUnit: data.preferredUnit,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: data.userId,
        action: "ONBOARDING_COMPLETED",
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: user.email,
        },
      },
    });

    return {
      success: true,
      message: "Onboarding completed successfully",
      profile,
      preferences,
    };
  });
}
