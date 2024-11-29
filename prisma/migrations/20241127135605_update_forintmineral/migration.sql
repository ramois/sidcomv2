/*
  Warnings:

  - Changed the type of `id_municipio_destino` on the `FormInt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FormInt" DROP COLUMN "id_municipio_destino",
ADD COLUMN     "id_municipio_destino" INTEGER NOT NULL;
