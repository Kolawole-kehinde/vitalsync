import { AuthError } from "@/src/lib/errors";
import { verifyEmail } from "@/src/services/auth/verify-email/verify-email.service";
import { verifyEmailSchema } from "@/src/validations/verify-email.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = verifyEmailSchema.safeParse(body);

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

    const ipAddress = forwardedFor?.split(",")[0]
        ?.trim() || "::1";

    const userAgent = request.headers.get(
        "user-agent"
      ) || undefined;

 const result = await verifyEmail({
  email: validated.data.email,
  otp: validated.data.otp,
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
          message:
            error.message,
        },
        {status: error.statusCode,}
      );}

    return NextResponse.json({
        success: false,
        message: "Internal server error",
      },
      { status: 500,}
    );
  }
}