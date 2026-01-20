-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picPublicId" TEXT,
ALTER COLUMN "pic" DROP DEFAULT;
