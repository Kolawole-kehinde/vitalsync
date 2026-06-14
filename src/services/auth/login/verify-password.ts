import argon2 from "argon2";

type VerifyPasswordData = {
  passwordHash: string;
  password: string;
};

export async function verifyPassword(data: VerifyPasswordData) {
  return argon2.verify(
    data.passwordHash,
    data.password
  );
}