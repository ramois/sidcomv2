/*
  Warnings:

  - The `humedad` column on the `Sample` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sample" DROP COLUMN "humedad",
ADD COLUMN     "humedad" INTEGER;
