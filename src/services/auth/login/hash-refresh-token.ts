import argon2 from "argon2";

export async function hashRefreshToken(refreshToken: string) {
  return await argon2.hash(
    refreshToken
  );
}