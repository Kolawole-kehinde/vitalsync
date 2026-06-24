import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";
import { loginService } from "@/src/services/auth/login/login.service";
import { loginSchema } from "@/src/validations/login.schema";
import { setAuthCookies } from "@/src/lib/auth-cookies";
import { checkLoginRateLimit } from "@/src/services/auth/login/check-login-rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validated.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const email = validated.data.email
      .trim()
      .toLowerCase();

    const ipAddress =
      req.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const userAgent =
      req.headers.get("user-agent") ??
      "unknown";

    await checkLoginRateLimit(
      email,
      ipAddress
    );

    const result = await loginService({
      email,
      candidatePassword:
        validated.data.password,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: result.user,
    });

    setAuthCookies(response, {
      accessToken:
        result.session.accessToken,
      refreshToken:
        result.session.refreshToken,
    });

    return response;
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: error.statusCode,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}