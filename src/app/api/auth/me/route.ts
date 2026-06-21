import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";

import { getAuthUser } from "@/src/services/auth/access-token/get-auth-user";

export async function GET() {
  try {
    const { user } = await getAuthUser();

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
        lastActivityAt: new Date()
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
