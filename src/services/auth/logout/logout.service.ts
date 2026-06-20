import { AuthError } from "@/src/lib/errors";
import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";

export async function logoutService(refreshToken: string){
   const parts = refreshToken.split(".");

   if(parts.length !==2){
      throw new AuthError(
        "Invalid refresh token",
        401
      )
   };

   const [sessionId] = parts

   const session = await prisma.session.findUnique({
     where: {
        id: sessionId
     }
   });

   if(!session){
      throw new AuthError(
        "Session not found",
        401
      )
   };

   await  prisma.session.update({
     where : {
        id: sessionId,
     },
     data:{
        isActive: false,
        revokedAt: new Date(),
        revokedReason: "USER_LOGOUT",

     }
   });

   await redis.del(
    `session${sessionId}`
   )

   return{
    success: true
   }
}

