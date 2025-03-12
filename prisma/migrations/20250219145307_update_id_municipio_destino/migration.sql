/*
  Warnings:

  - You are about to drop the column `municipio_destino_id` on the `FormInt` table. All the data in the column will be lost.
  - Added the required column `id_municipio_destino` to the `FormInt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_municipio_destino_id_fkey";

-- AlterTable
ALTER TABLE "FormInt" DROP COLUMN "municipio_destino_id",
ADD COLUMN     "id_municipio_destino" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_id_municipio_destino_fkey" FOREIGN KEY ("id_municipio_destino") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
