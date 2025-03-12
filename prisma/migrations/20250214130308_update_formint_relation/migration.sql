/*
  Warnings:

  - You are about to drop the column `id_municipio_destino` on the `FormInt` table. All the data in the column will be lost.
  - You are about to drop the column `presentacion` on the `FormInt` table. All the data in the column will be lost.
  - Made the column `presentacion_id` on table `Sample` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sample" DROP CONSTRAINT "Sample_presentacion_id_fkey";

-- AlterTable
ALTER TABLE "FormInt" DROP COLUMN "id_municipio_destino",
DROP COLUMN "presentacion",
ADD COLUMN     "municipio_destino_id" INTEGER,
ADD COLUMN     "presentacion_id" INTEGER;

-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "presentacion_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_municipio_destino_id_fkey" FOREIGN KEY ("municipio_destino_id") REFERENCES "Municipios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
