import { prisma } from "@/src/lib/prisma";
import { redis } from "@/src/lib/redis";
import { verifyRefreshToken } from "../refresh/verify-refresh-token";


export async function logoutAllService(refreshToken: string){

    const session = await verifyRefreshToken(refreshToken);

    await prisma.session.updateMany({
        where: {
            userId: session.userId,
            isActive: true,
        },
        data:{
            isActive: false,
            revokedAt: new Date(),
            revokedReason: "LOGOUT_ALL_DEVICES"
        }
    });

    const sessions = await prisma.session.findMany({
        where: {
            userId: session.userId,
        },
        select:{
            id: true
        }
    });

    await Promise.all(
        sessions.map((s) =>(
            redis.del(
             `sessions:${s.id}`
            )
        )));

        return{
            success: true
        }
}