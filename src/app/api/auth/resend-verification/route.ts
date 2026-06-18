import { NextRequest, NextResponse } from "next/server";
import { AuthError } from "@/src/lib/errors";
import { resendVerificationSchema } from "@/src/validations/resend-verification.schema";
import { resendVerificationEmail } from "@/src/services/auth/verify-email/resend-verification.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = resendVerificationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({
          success: false,
          errors: validated.error.flatten(),
        },
        {status: 400,}
      );
    }

    const forwardedFor = request.headers.get(
        "x-forwarded-for"
      );

    const ipAddress =forwardedFor
        ?.split(",")[0]
        ?.trim() || "::1";

    const userAgent =request.headers.get(
        "user-agent"
      ) || undefined;

    const result = await resendVerificationEmail({
        email: validated.data.email,
        ipAddress,
        userAgent,
      });

    return NextResponse.json(
      result,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof AuthError) {
      return NextResponse.json({
          success: false,
          message: error.message,
        },
        {status: error.statusCode,
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