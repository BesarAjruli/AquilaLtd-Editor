/*
  Warnings:

  - Added the required column `category` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_type` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "device_type" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
