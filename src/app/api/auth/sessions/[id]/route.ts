import { NextResponse } from "next/server";

import { AuthError } from "@/src/lib/errors";

import { getAuthUser } from "@/src/services/auth/access-token/get-auth-user";
import { revokeSession } from "@/src/services/auth/sessions/revoke-session.service";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request,{ params }: RouteParams) {
  try {
    const { id } = await params;

    const { user } = await getAuthUser();

    await revokeSession(
      user.id,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error(
      "REVOKE SESSION ERROR:",
      error
    );

    if ( error instanceof AuthError) {
      return NextResponse.json({
          success: false,
          message: error.message,
        },
        { status: error.statusCode,
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