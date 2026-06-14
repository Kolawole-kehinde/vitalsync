-- AlterEnum
ALTER TYPE "LoginFailureReason" ADD VALUE 'INVALID_CREDENTIALS';

-- AlterTable
ALTER TABLE "LoginAttempt" ADD COLUMN     "userAgent" TEXT;
