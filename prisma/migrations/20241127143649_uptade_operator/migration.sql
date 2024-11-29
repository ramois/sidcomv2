/*
  Warnings:

  - The `estado` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'ACTIVO';
