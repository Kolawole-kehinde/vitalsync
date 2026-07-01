-- AlterTable
ALTER TABLE "WellnessPreferences" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en-NG',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos';
