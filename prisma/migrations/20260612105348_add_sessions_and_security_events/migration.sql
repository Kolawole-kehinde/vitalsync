-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('IMPOSSIBLE_TRAVEL', 'NEW_COUNTRY_LOGIN', 'NEW_DEVICE_LOGIN', 'MULTIPLE_FAILED_LOGINS', 'PASSWORD_CHANGED', 'LOGOUT_ALL_DEVICES', 'TOKEN_REUSE_DETECTED');

-- DropIndex
DROP INDEX "Session_refreshTokenHash_key";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SecurityEventType" NOT NULL,
    "ipAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SecurityEvent_userId_idx" ON "SecurityEvent"("userId");

-- CreateIndex
CREATE INDEX "SecurityEvent_type_idx" ON "SecurityEvent"("type");

-- CreateIndex
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "SecurityEvent" ADD CONSTRAINT "SecurityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
