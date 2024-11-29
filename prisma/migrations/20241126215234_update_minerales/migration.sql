/*
  Warnings:

  - The `estado` column on the `Mineral` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Mineral" ADD COLUMN     "tipo" TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'ACTIVO';
