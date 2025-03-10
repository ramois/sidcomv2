/*
  Warnings:

  - You are about to drop the column `presentacion` on the `FormExt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormExt" DROP COLUMN "presentacion",
ADD COLUMN     "presentacion_id" INTEGER;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
