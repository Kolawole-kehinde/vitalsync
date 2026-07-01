import { AuthError } from "@/src/lib/errors";

export function extractAccessToken( authorizationHeader: string | null): string {
  if (!authorizationHeader) {
    throw new AuthError("Unauthorized", 401);
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AuthError(
      "Invalid authorization header",
      401
    );
  }

  return token;
}