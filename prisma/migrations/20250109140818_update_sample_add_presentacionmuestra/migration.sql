/*
  Warnings:

  - You are about to drop the column `camiones` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_emision` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `formExtId` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `id_municipio` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `id_operador` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `lotes` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `peso_neto` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `peso_parcial` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `responsable` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `sacos` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `senerecom` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_agranel` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_emsacado` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_lingotes` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_otr` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_sal` on the `Sample` table. All the data in the column will be lost.
  - You are about to drop the column `ubi_geografica` on the `Sample` table. All the data in the column will be lost.
  - The `estado` column on the `Sample` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `created_at` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_hora_tdm` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lote` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio_id` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nro_formulario` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operador_id` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_neto_total` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion_lat` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion_lon` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Sample` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Sample` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoSample" AS ENUM ('GENERADO', 'SOLICITADO', 'APROBADO', 'FIRMADO', 'ANULADO');

-- DropForeignKey
ALTER TABLE "Sample" DROP CONSTRAINT "Sample_id_operador_fkey";

-- DropIndex
DROP INDEX "FormExt_id_sample_key";

-- DropIndex
DROP INDEX "Sample_formExtId_key";

-- AlterTable
ALTER TABLE "Sample" DROP COLUMN "camiones",
DROP COLUMN "fecha_emision",
DROP COLUMN "formExtId",
DROP COLUMN "id_municipio",
DROP COLUMN "id_operador",
DROP COLUMN "lotes",
DROP COLUMN "peso_neto",
DROP COLUMN "peso_parcial",
DROP COLUMN "responsable",
DROP COLUMN "sacos",
DROP COLUMN "senerecom",
DROP COLUMN "tipo_agranel",
DROP COLUMN "tipo_emsacado",
DROP COLUMN "tipo_lingotes",
DROP COLUMN "tipo_otr",
DROP COLUMN "tipo_sal",
DROP COLUMN "ubi_geografica",
ADD COLUMN     "cantidad" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "departamento_id" INTEGER,
ADD COLUMN     "fecha_aprobacion" TIMESTAMP(3),
ADD COLUMN     "fecha_firma" TIMESTAMP(3),
ADD COLUMN     "fecha_hora_tdm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "justificacion_anulacion" TEXT,
ADD COLUMN     "lote" TEXT NOT NULL,
ADD COLUMN     "municipio_id" INTEGER NOT NULL,
ADD COLUMN     "nro_camiones" INTEGER,
ADD COLUMN     "nro_formulario" TEXT NOT NULL,
ADD COLUMN     "operador_id" INTEGER NOT NULL,
ADD COLUMN     "peso_neto_parcial" DECIMAL(65,30),
ADD COLUMN     "peso_neto_total" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "responsable_tdm_gador_id" INTEGER,
ADD COLUMN     "responsable_tdm_id" INTEGER,
ADD COLUMN     "responsable_tdm_senarecom_id" INTEGER,
ADD COLUMN     "total_parcial" DECIMAL(65,30),
ADD COLUMN     "ubicacion_lat" TEXT NOT NULL,
ADD COLUMN     "ubicacion_lon" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "tipo_muestra" SET DATA TYPE TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoSample" NOT NULL DEFAULT 'GENERADO';

-- AlterTable
ALTER TABLE "SampleMineral" ALTER COLUMN "ley" DROP NOT NULL,
ALTER COLUMN "ley" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "unidad" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SampleMunicipio" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "SampleMunicipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedimientoMuestra" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "procedimiento" TEXT NOT NULL,

    CONSTRAINT "ProcedimientoMuestra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleProcedimientoMuestra" (
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "procedimientoId" INTEGER NOT NULL,

    CONSTRAINT "SampleProcedimientoMuestra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMunicipio" ADD CONSTRAINT "SampleMunicipio_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMunicipio" ADD CONSTRAINT "SampleMunicipio_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleProcedimientoMuestra" ADD CONSTRAINT "SampleProcedimientoMuestra_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleProcedimientoMuestra" ADD CONSTRAINT "SampleProcedimientoMuestra_procedimientoId_fkey" FOREIGN KEY ("procedimientoId") REFERENCES "ProcedimientoMuestra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
