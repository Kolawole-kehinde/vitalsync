import argon2 from "argon2";
 export async function hashResetToken(resetToken: string){
  return await argon2.hash(resetToken)
 }