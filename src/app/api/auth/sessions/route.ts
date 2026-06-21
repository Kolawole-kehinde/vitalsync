import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";

import { getAuthUser } from "@/src/services/auth/access-token/get-auth-user";
import { getUserSessions } from "@/src/services/auth/sessions/get-user-sessions.service";

export async function GET() {
  try {
    const { user, sessionId } = await getAuthUser();

    const sessions = await getUserSessions(user.id, sessionId);

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("GET SESSIONS ERROR:", error);

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
