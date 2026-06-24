import { prisma } from "@/src/lib/prisma";
import { checkForgetPasswordRateLimit } from "./check-forgot-password-rate-limit";
import { generateResetToken } from "./generate-reset-token";
import { hashResetToken } from "./hash-reset-token";
import { queueForgotPasswordEmail } from "./queue-password-reset-email";

type ForgetPasswordData = {
    email: string;
    ipAddress?: string;
    userAgent?: string;
};

export async function forgetPasswordService(data: ForgetPasswordData) {
    const email = data.email.trim().toLowerCase();

    // Rate limit
    await checkForgetPasswordRateLimit({
        email,
        ipAddress: data.ipAddress ?? "unknown",
    });

    // User lookup
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    // Never reveal account existence
    if (!existingUser) {
        return {
            success: true,
            message: "If an account exists, a reset link has been sent.",
        };
    }

    // Generate token
    const resetToken = generateResetToken();

    // Hash token
    const tokenHash = await hashResetToken(resetToken);

    // Remove previous unused reset tokens
    await prisma.passwordReset.deleteMany({
        where: {
            userId: existingUser.id,
            usedAt: null,
        },
    });

    // Create new reset token
    await prisma.passwordReset.create({
        data: {
            userId: existingUser.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    });

    // Security Event + Audit Log
    await prisma.$transaction(async (tx) => {
        await tx.securityEvent.create({
            data: {
                type: "PASSWORD_RESET_REQUESTED",
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                metadata: {
                    email,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            },
        });

        await tx.auditLog.create({
            data: {
                userId: existingUser.id,
                action: "PASSWORD_RESET_REQUESTED",
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                metadata: {
                    email,
                },
            },
        });
    });

    // Queue email
    await queueForgotPasswordEmail({
        email,
        resetToken,
    });

    return {
        success: true,
        message: "If an account exists, a reset link has been sent.",
    };
}
