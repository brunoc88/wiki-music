/*
  Warnings:

  - Made the column `pic` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pic" SET NOT NULL,
ALTER COLUMN "pic" SET DEFAULT 'default.png';
