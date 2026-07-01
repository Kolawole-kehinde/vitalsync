import { NextRequest } from "next/server";

export function getRequestInfo(req: NextRequest) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const userAgent =
    req.headers.get("user-agent") ??
    "Unknown";

  return {
    ipAddress,
    userAgent,
  };
}