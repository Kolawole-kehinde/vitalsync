import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";

import { forgetPasswordService } from "@/src/services/auth/forgot-password/forgot-password.service";
import { forgotPasswordSchema } from "@/src/validations/forgot-password.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = forgotPasswordSchema.parse(body);

    const ipAddress =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const userAgent = req.headers.get("user-agent") ?? "unknown";

    const result = await forgetPasswordService({
      email: data.email,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(result);
  } catch (error) {
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

    console.error("FORGOT PASSWORD ERROR:", error);

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
