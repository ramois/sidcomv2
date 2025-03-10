/*
  Warnings:

  - Made the column `presentacion_id` on table `FormExt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FormExt" DROP CONSTRAINT "FormExt_presentacion_id_fkey";

-- AlterTable
ALTER TABLE "FormExt" ALTER COLUMN "presentacion_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
