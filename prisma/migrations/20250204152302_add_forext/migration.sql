/*
  Warnings:

  - You are about to drop the column `cod_analisis` on the `FormExt` table. All the data in the column will be lost.
  - You are about to drop the column `des_aduana` on the `FormExt` table. All the data in the column will be lost.
  - You are about to drop the column `des_comprador` on the `FormExt` table. All the data in the column will be lost.
  - You are about to drop the column `des_pais` on the `FormExt` table. All the data in the column will be lost.
  - You are about to drop the column `m03` on the `FormExt` table. All the data in the column will be lost.
  - You are about to drop the column `presentacion` on the `Sample` table. All the data in the column will be lost.
  - Added the required column `aduana_id` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo_analisis` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comprador` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lote` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `m03_id` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nro_formulario` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nro_formulario_tm` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operador_id` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_destino_id` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_bruto_humedo` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_neto` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentacion` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FormExt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormExt" DROP CONSTRAINT "FormExt_id_sample_fkey";

-- AlterTable
ALTER TABLE "FormExt" DROP COLUMN "cod_analisis",
DROP COLUMN "des_aduana",
DROP COLUMN "des_comprador",
DROP COLUMN "des_pais",
DROP COLUMN "m03",
ADD COLUMN     "aduana_id" INTEGER NOT NULL,
ADD COLUMN     "cantidad" INTEGER,
ADD COLUMN     "codigo_analisis" TEXT NOT NULL,
ADD COLUMN     "comprador" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "empresa_ferrea" TEXT,
ADD COLUMN     "estado" "EstadoForm" NOT NULL DEFAULT 'GENERADO',
ADD COLUMN     "fecha_creacion" TIMESTAMP(3),
ADD COLUMN     "fecha_ferrea" TEXT,
ADD COLUMN     "fecha_vencimiento" TIMESTAMP(3),
ADD COLUMN     "hr_ferrea" TEXT,
ADD COLUMN     "humedad" INTEGER,
ADD COLUMN     "justificacion_anulacion" TEXT,
ADD COLUMN     "lote" TEXT NOT NULL,
ADD COLUMN     "m03_id" TEXT NOT NULL,
ADD COLUMN     "merma" INTEGER,
ADD COLUMN     "nro_formulario" TEXT NOT NULL,
ADD COLUMN     "nro_formulario_tm" TEXT NOT NULL,
ADD COLUMN     "nro_varon" TEXT,
ADD COLUMN     "operador_id" INTEGER NOT NULL,
ADD COLUMN     "pais_destino_id" INTEGER NOT NULL,
ADD COLUMN     "peso_bruto_humedo" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "peso_neto" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "presentacion" INTEGER NOT NULL,
ADD COLUMN     "tara" INTEGER,
ADD COLUMN     "tara_volqueta" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "id_sample" DROP NOT NULL,
ALTER COLUMN "nro_factura_exportacion" SET DATA TYPE TEXT,
ALTER COLUMN "placa" DROP NOT NULL,
ALTER COLUMN "nom_conductor" DROP NOT NULL,
ALTER COLUMN "licencia" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sample" DROP COLUMN "presentacion",
ADD COLUMN     "presentacion_id" INTEGER;

-- CreateTable
CREATE TABLE "FormExtMineral" (
    "formExtId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,
    "ley" DECIMAL(65,30),
    "unidad" TEXT,

    CONSTRAINT "FormExtMineral_pkey" PRIMARY KEY ("formExtId","mineralId")
);

-- CreateTable
CREATE TABLE "FormExtMunicipio" (
    "formExtId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "FormExtMunicipio_pkey" PRIMARY KEY ("formExtId","municipioId")
);

-- CreateTable
CREATE TABLE "Pais" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aduana" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_aduana" TEXT NOT NULL,
    "latitud" DECIMAL(65,30) NOT NULL,
    "longitud" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Aduana_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_responsable_tdm_gador_id_fkey" FOREIGN KEY ("responsable_tdm_gador_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_presentacion_id_fkey" FOREIGN KEY ("presentacion_id") REFERENCES "Presentacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_id_sample_fkey" FOREIGN KEY ("id_sample") REFERENCES "Sample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExtMineral" ADD CONSTRAINT "FormExtMineral_formExtId_fkey" FOREIGN KEY ("formExtId") REFERENCES "FormExt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExtMineral" ADD CONSTRAINT "FormExtMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExtMunicipio" ADD CONSTRAINT "FormExtMunicipio_formExtId_fkey" FOREIGN KEY ("formExtId") REFERENCES "FormExt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExtMunicipio" ADD CONSTRAINT "FormExtMunicipio_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
