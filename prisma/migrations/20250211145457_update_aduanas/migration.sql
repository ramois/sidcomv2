/*
  Warnings:

  - Added the required column `continente` to the `Pais` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aduana" ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'ACTIVO';

-- AlterTable
ALTER TABLE "Pais" ADD COLUMN     "continente" TEXT NOT NULL;
