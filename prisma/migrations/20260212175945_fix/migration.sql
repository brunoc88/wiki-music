-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");
