import { REFRESH_TOKEN_COOKIE } from "@/src/constants/cookie.constants";
import { clearAuthCookies } from "@/src/lib/auth-cookies";
import { AuthError } from "@/src/lib/errors";
import { logoutService } from "@/src/services/auth/logout/logout.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      throw new AuthError(
        "Refresh token missing",
        401
      );
    }

    await logoutService(
      refreshToken
    );

    const response = NextResponse.json({
        success: true,
        message:"Logged out successfully",
      });

    clearAuthCookies(response);

    return response;


  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    if (error instanceof AuthError) {
      return NextResponse.json({
          success: false,
          message: error.message,
        },
        {status: error.statusCode,
        }
      );
    }

    return NextResponse.json({
        success: false,
        message: "Internal server error",
      },
      { status: 500,}
    );
  }
}