import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthError } from "@/src/lib/errors";
import { refreshSession } from "@/src/services/auth/refresh/refresh.service";
import { setAuthCookies } from "@/src/lib/auth-cookies";
import { REFRESH_TOKEN_COOKIE } from "@/src/constants/cookie.constants";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      throw new AuthError(
      "Refresh token missing", 401);
    }

    const result = await refreshSession(refreshToken);

    const response = NextResponse.json({
      success: true,
      message: "Session refreshed",
    });

    setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return response;
  } catch (error) {
    console.error("REFRESH ERROR:", error);

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
