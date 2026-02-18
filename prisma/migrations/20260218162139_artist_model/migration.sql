-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtistToGender" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArtistToGender_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- CreateIndex
CREATE INDEX "_ArtistToGender_B_index" ON "_ArtistToGender"("B");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToGender" ADD CONSTRAINT "_ArtistToGender_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToGender" ADD CONSTRAINT "_ArtistToGender_B_fkey" FOREIGN KEY ("B") REFERENCES "Gender"("id") ON DELETE CASCADE ON UPDATE CASCADE;
