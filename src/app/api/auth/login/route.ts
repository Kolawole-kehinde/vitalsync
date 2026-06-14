import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";
import { loginService } from "@/src/services/auth/login/login.service";
import { loginSchema } from "@/src/validations/login.schema";

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

    const result = await loginService({
      email: validated.data.email,
      password: validated.data.password,
        ipAddress: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
        userAgent: req.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}