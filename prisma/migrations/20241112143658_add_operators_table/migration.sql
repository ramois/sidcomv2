/*
  Warnings:

  - You are about to drop the column `celular_2` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `celular_resp_for101` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `celular_resp_tmuestra` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `ci_resp_for101` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `ci_resp_tmuestra` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `correo_resp_for101` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `correo_resp_tmuestra` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_resp_for101` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_resp_tmuestra` on the `Operator` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Operator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "celular_2",
DROP COLUMN "celular_resp_for101",
DROP COLUMN "celular_resp_tmuestra",
DROP COLUMN "ci_resp_for101",
DROP COLUMN "ci_resp_tmuestra",
DROP COLUMN "correo_resp_for101",
DROP COLUMN "correo_resp_tmuestra",
DROP COLUMN "nombre_resp_for101",
DROP COLUMN "nombre_resp_tmuestra",
ADD COLUMN     "act_calcinacion" INTEGER DEFAULT 0,
ADD COLUMN     "act_tostacion" INTEGER DEFAULT 0,
ADD COLUMN     "ci_link" TEXT,
ADD COLUMN     "comercio_interno_coperativa" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "doc_creacion_estatal_link" TEXT,
ADD COLUMN     "doc_explotacion_link" TEXT,
ADD COLUMN     "estado" INTEGER,
ADD COLUMN     "fax_op_min" TEXT,
ADD COLUMN     "fecha_actualizacion" TIMESTAMP(3),
ADD COLUMN     "fecha_creacion" TIMESTAMP(3),
ADD COLUMN     "fecha_expiracion" TIMESTAMP(3),
ADD COLUMN     "nim_link" TEXT,
ADD COLUMN     "nit_link" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "ofi_lat" TEXT,
ADD COLUMN     "ofi_lon" TEXT,
ADD COLUMN     "otro_celular" INTEGER,
ADD COLUMN     "personeria_juridica_link" TEXT,
ADD COLUMN     "rep_celular" INTEGER,
ADD COLUMN     "rep_ci" TEXT,
ADD COLUMN     "rep_correo" TEXT,
ADD COLUMN     "rep_departamento_id" INTEGER,
ADD COLUMN     "rep_direccion" TEXT,
ADD COLUMN     "rep_municipio_id" INTEGER,
ADD COLUMN     "rep_nombre_completo" TEXT,
ADD COLUMN     "rep_telefono" INTEGER,
ADD COLUMN     "resolucion_min_fundind_link" TEXT,
ADD COLUMN     "ruex_link" TEXT,
ADD COLUMN     "seprec_link" TEXT,
ADD COLUMN     "transbordo" INTEGER,
ADD COLUMN     "traslado_colas" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificacion_toma_muestra" INTEGER,
ALTER COLUMN "nit" DROP NOT NULL,
ALTER COLUMN "nim_niar" DROP NOT NULL,
ALTER COLUMN "nro_nim" DROP NOT NULL,
ALTER COLUMN "fecha_exp_nim" DROP NOT NULL,
ALTER COLUMN "tipo_operador" DROP NOT NULL,
ALTER COLUMN "dl_departamento" DROP NOT NULL,
ALTER COLUMN "dl_municipio" DROP NOT NULL,
ALTER COLUMN "dl_direccion" DROP NOT NULL,
ALTER COLUMN "dl_ubicacion" DROP NOT NULL,
ALTER COLUMN "celular" DROP NOT NULL;
