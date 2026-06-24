-- AlterEnum
ALTER TYPE "AuditAction" ADD VALUE 'PASSWORD_CHANGED';

-- CreateIndex
CREATE INDEX "PasswordReset_usedAt_idx" ON "PasswordReset"("usedAt");
