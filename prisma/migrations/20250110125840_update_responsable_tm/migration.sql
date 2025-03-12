/*
  Warnings:

  - Made the column `operador_id` on table `ResponsableTM` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ResponsableTM" DROP CONSTRAINT "ResponsableTM_operador_id_fkey";

-- AlterTable
ALTER TABLE "ResponsableTM" ALTER COLUMN "operador_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ResponsableTM" ADD CONSTRAINT "ResponsableTM_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
