import { NextRequest, NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";
import { extractAccessToken } from "@/src/lib/auth/extract-access-token";

import { verifyAccessToken } from "@/src/services/auth/access-token/verify-access-token";
import { onboardingService } from "@/src/services/onboarding/onboarding.service";

import { onboardingSchema } from "@/src/validations/onboarding/onboarding.schema";

import { getRequestInfo } from "@/src/helper/request";

export async function POST(req: NextRequest) {
  try {
    // Extract and verify access token
    const token = extractAccessToken(req.headers.get("authorization"));
    // console.log(token);

    const payload = await verifyAccessToken(token);

    // Parse request body
    const body = await req.json();

    // Validate request body
    const validated = onboardingSchema.safeParse(body);

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

    // Request metadata
    const { ipAddress, userAgent } = getRequestInfo(req);

    // Execute onboarding
    const result = await onboardingService({
      userId: payload.sub,
      ipAddress,
      userAgent,
      ...validated.data,
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("ONBOARDING ERROR:", error);

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