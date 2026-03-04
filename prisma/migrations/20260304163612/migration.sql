/*
  Warnings:

  - A unique constraint covering the columns `[name,artistId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,albumId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Album_name_key";

-- DropIndex
DROP INDEX "Song_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Album_name_artistId_key" ON "Album"("name", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_name_albumId_key" ON "Song"("name", "albumId");
