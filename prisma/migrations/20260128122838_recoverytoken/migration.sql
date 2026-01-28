-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recoveryExpires" TIMESTAMP(3),
ADD COLUMN     "recoveryToken" TEXT;
