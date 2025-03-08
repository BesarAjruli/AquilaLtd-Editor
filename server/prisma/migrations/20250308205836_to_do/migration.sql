-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bundle" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imagesLimit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "pages" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "ToDo" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "publicId" TEXT NOT NULL,

    CONSTRAINT "ToDo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
