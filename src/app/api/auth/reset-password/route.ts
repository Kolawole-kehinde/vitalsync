import { NextResponse } from "next/server";
import { AuthError } from "@/src/lib/errors";
import { resetPasswordService } from "@/src/services/auth/reset-password/reset-password.service";
import { resetPasswordSchema } from "@/src/validations/reset-password.schema";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = resetPasswordSchema.parse(body);

        const ipAddress =
            req.headers.get(
                "x-forwarded-for"
            ) ??
            req.headers.get(
                "x-real-ip"
            ) ??
            "unknown";

        const userAgent =
            req.headers.get(
                "user-agent"
            ) ?? "unknown";

        const result = await resetPasswordService({
                resetToken: data.resetToken,
                password: data.password,
                ipAddress,
                userAgent,
            });

        return NextResponse.json(
            result
        );

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

        if (
            error instanceof AuthError
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error.message,
                },
                {
                    status:
                        error.statusCode,
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
