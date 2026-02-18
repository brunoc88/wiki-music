/*
  Warnings:

  - Added the required column `pic` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "pic" TEXT NOT NULL,
ADD COLUMN     "picPublicId" TEXT;
