/*
  Warnings:

  - You are about to drop the column `nro_varon` on the `FormExt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormExt" DROP COLUMN "nro_varon",
ADD COLUMN     "nro_vagon" TEXT;
