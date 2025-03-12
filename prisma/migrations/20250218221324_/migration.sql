/*
  Warnings:

  - You are about to drop the column `denominacion_area` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `dl_departamento` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `dl_municipio` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `dl_ubicacion` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `municipio_origen` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `nro_codigo_unico` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `nro_cuadricula` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_explotacion` on the `Operator` table. All the data in the column will be lost.
  - The `verif_cert_liberacion` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `comercio_interno_coperativa` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transbordo` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `traslado_colas` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `verificacion_toma_muestra` column on the `Operator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `municipio_destino_id` on table `FormInt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentacion_id` on table `FormInt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_municipio_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_presentacion_id_fkey";

-- AlterTable
ALTER TABLE "FormInt" ALTER COLUMN "municipio_destino_id" SET NOT NULL,
ALTER COLUMN "presentacion_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "denominacion_area",
DROP COLUMN "dl_departamento",
DROP COLUMN "dl_municipio",
DROP COLUMN "dl_ubicacion",
DROP COLUMN "municipio_origen",
DROP COLUMN "nro_codigo_unico",
DROP COLUMN "nro_cuadricula",
DROP COLUMN "tipo_explotacion",
ADD COLUMN     "dl_departamento_id" INTEGER,
ADD COLUMN     "dl_municipio_id" INTEGER,
ADD COLUMN     "fecha_exp_ruex" TIMESTAMP(3),
DROP COLUMN "verif_cert_liberacion",
ADD COLUMN     "verif_cert_liberacion" BOOLEAN DEFAULT false,
DROP COLUMN "comercio_interno_coperativa",
ADD COLUMN     "comercio_interno_coperativa" BOOLEAN DEFAULT false,
ALTER COLUMN "rep_telefono" SET DATA TYPE TEXT,
DROP COLUMN "transbordo",
ADD COLUMN     "transbordo" BOOLEAN DEFAULT false,
DROP COLUMN "traslado_colas",
ADD COLUMN     "traslado_colas" BOOLEAN DEFAULT false,
DROP COLUMN "verificacion_toma_muestra",
ADD COLUMN     "verificacion_toma_muestra" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Arrendamiento" (
    "id" SERIAL NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "codigo_unico" INTEGER,
    "nro_cuadricula" INTEGER,
    "denominacion_area" TEXT,
    "departamento_id" INTEGER,
    "municipio_id" INTEGER NOT NULL,
    "tipo_explotacion" TEXT,

    CONSTRAINT "Arrendamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OficinaOperator" (
    "id" SERIAL NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "departamento_id" INTEGER,
    "municipio_id" INTEGER NOT NULL,
    "tipo" TEXT,
    "direccion" TEXT,
    "latitud" TEXT,
    "longitud" TEXT,

    CONSTRAINT "OficinaOperator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_dl_municipio_id_fkey" FOREIGN KEY ("dl_municipio_id") REFERENCES "Municipios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_rep_municipio_id_fkey" FOREIGN KEY ("rep_municipio_id") REFERENCES "Municipios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrendamiento" ADD CONSTRAINT "Arrendamiento_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrendamiento" ADD CONSTRAINT "Arrendamiento_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OficinaOperator" ADD CONSTRAINT "OficinaOperator_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OficinaOperator" ADD CONSTRAINT "OficinaOperator_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_municipio_destino_id_fkey" FOREIGN KEY ("municipio_destino_id") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
