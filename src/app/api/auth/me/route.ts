import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";

import { getAuthUser } from "@/src/services/auth/access-token/get-auth-user";
import { calculateProfileCompletion } from "@/src/services/profile/calculate-profile-completion";

export async function GET() {
  try {
    const { user, session } = await getAuthUser();

    // Calculate profile completion
    const profileCompletion = calculateProfileCompletion(user);

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: !!user.emailVerifiedAt,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },

      profile: user.profile
        ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            avatar: user.profile.avatar,
            gender: user.profile.gender,
            dateOfBirth: user.profile.dateOfBirth,
            height: user.profile.height,
            weight: user.profile.weight,
          }
        : null,

      preferences: user.wellnessPreferences
        ? {
            activityLevel: user.wellnessPreferences.activityLevel,

            primaryGoal: user.wellnessPreferences.primaryGoal,

            preferredUnit: user.wellnessPreferences.preferredUnit,

            timezone: user.wellnessPreferences.timezone,

            locale: user.wellnessPreferences.locale,

            calorieGoal: user.wellnessPreferences.calorieGoal,

            hydrationGoal: user.wellnessPreferences.hydrationGoal,

            sleepGoal: user.wellnessPreferences.sleepGoal,

            stepGoal: user.wellnessPreferences.stepGoal,

            notificationsEnabled: user.wellnessPreferences.notificationsEnabled,
          }
        : null,

      session: session
        ? {
            lastActivityAt: session.lastActivityAt,
            expiresAt: session.expiresAt,
          }
        : null,

      stats: {
        profileCompletion,
      },
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
