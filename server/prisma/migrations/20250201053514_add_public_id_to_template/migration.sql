/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `premium` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verified` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "premium" BOOLEAN NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_id_key" ON "User"("username", "id");
