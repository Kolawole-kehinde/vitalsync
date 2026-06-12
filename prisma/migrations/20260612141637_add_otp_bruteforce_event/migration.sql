-- AlterEnum
ALTER TYPE "SecurityEventType" ADD VALUE 'OTP_BRUTE_FORCE';

-- AlterTable
ALTER TABLE "SecurityEvent" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;
