/*
  Warnings:

  - You are about to drop the column `id_municipio_origen` on the `FormInt` table. All the data in the column will be lost.
  - You are about to drop the column `id_operador` on the `FormInt` table. All the data in the column will be lost.
  - You are about to drop the column `lotes` on the `FormInt` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lote` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nro_formulario` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operador_id` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_bruto_humedo` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FormInt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoForm" AS ENUM ('GENERADO', 'EMITIDO', 'VENCIDO', 'ANULADO');

-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_id_operador_fkey";

-- AlterTable
ALTER TABLE "FormInt" DROP COLUMN "id_municipio_origen",
DROP COLUMN "id_operador",
DROP COLUMN "lotes",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "empresa_ferrea" TEXT,
ADD COLUMN     "estado" "EstadoForm" NOT NULL DEFAULT 'GENERADO',
ADD COLUMN     "fecha_creacion" TIMESTAMP(3),
ADD COLUMN     "fecha_ferrea" TIMESTAMP(3),
ADD COLUMN     "fecha_vencimiento" TIMESTAMP(3),
ADD COLUMN     "hr_ferrea" TEXT,
ADD COLUMN     "justificacion_anulacion" TEXT,
ADD COLUMN     "lote" TEXT NOT NULL,
ADD COLUMN     "nro_formulario" TEXT NOT NULL,
ADD COLUMN     "nro_vagon" TEXT,
ADD COLUMN     "operador_id" INTEGER NOT NULL,
ADD COLUMN     "peso_bruto_humedo" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "tara_volqueta" DECIMAL(65,30),
ADD COLUMN     "traslado_mineral" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FormIntMunicipio" (
    "id" SERIAL NOT NULL,
    "formIntId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "FormIntMunicipio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMunicipio" ADD CONSTRAINT "FormIntMunicipio_formIntId_fkey" FOREIGN KEY ("formIntId") REFERENCES "FormInt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMunicipio" ADD CONSTRAINT "FormIntMunicipio_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
