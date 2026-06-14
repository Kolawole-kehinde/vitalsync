import { AuthError } from "@/src/lib/errors";
import { registerUser } from "@/src/services/auth/register/register.service";
import { registerSchema } from "@/src/validations/register.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({
          success: false,
          errors: validated.error.flatten(),
        },
        {status: 400,}
      );
    }

    const ipAddress = req.headers.get("x-forwarded-for") ?? req.headers.get(
        "x-real-ip") ?? "unknown";

    const userAgent = req.headers.get("user-agent") ??"unknown";

    console.log({ipAddress,userAgent,});

    const result = await registerUser({
        email: validated.data.email,
        password: validated.data.password,
        ipAddress,
        userAgent,
      });

    return NextResponse.json(
      result,
      {status: 201,}
    );
  } catch (error) {
    console.error(error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        {success: false,
        message: error.message,
        },
        {status: error.statusCode,
        }
      );
    }

    return NextResponse.json({
        success: false,
        message:"Something went wrong",
      },
      {status: 500,}
    );
  }
}