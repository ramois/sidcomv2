/*
  Warnings:

  - Made the column `operador_id` on table `FormInt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_operador_id_fkey";

-- AlterTable
ALTER TABLE "FormInt" ALTER COLUMN "operador_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
