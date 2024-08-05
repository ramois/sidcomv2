/*
  Warnings:

  - Added the required column `celular` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dl_departamento` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dl_direccion` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dl_municipio` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dl_ubicacion` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_exp_nim` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nro_nim` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_operador` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `nit` on the `Operator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nim_niar` on the `Operator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Operator" ADD COLUMN     "act_ben_concentracion" INTEGER DEFAULT 0,
ADD COLUMN     "act_comer_externa" INTEGER DEFAULT 0,
ADD COLUMN     "act_comer_interna" INTEGER DEFAULT 0,
ADD COLUMN     "act_exploracion" INTEGER DEFAULT 0,
ADD COLUMN     "act_explotacion" INTEGER DEFAULT 0,
ADD COLUMN     "act_fundicion" INTEGER DEFAULT 0,
ADD COLUMN     "act_industrializacion" INTEGER DEFAULT 0,
ADD COLUMN     "act_refinacion" INTEGER DEFAULT 0,
ADD COLUMN     "act_tras_colas" INTEGER DEFAULT 0,
ADD COLUMN     "celular" INTEGER NOT NULL,
ADD COLUMN     "celular_2" INTEGER,
ADD COLUMN     "celular_resp_for101" INTEGER,
ADD COLUMN     "celular_resp_tmuestra" INTEGER,
ADD COLUMN     "ci_resp_for101" TEXT,
ADD COLUMN     "ci_resp_tmuestra" TEXT,
ADD COLUMN     "correo_inst" TEXT,
ADD COLUMN     "correo_resp_for101" TEXT,
ADD COLUMN     "correo_resp_tmuestra" TEXT,
ADD COLUMN     "denominacion_area" TEXT,
ADD COLUMN     "dl_departamento" INTEGER NOT NULL,
ADD COLUMN     "dl_direccion" TEXT NOT NULL,
ADD COLUMN     "dl_municipio" INTEGER NOT NULL,
ADD COLUMN     "dl_ubicacion" TEXT NOT NULL,
ADD COLUMN     "doc_creacion" TEXT,
ADD COLUMN     "fecha_exp_nim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_exp_seprec" TIMESTAMP(3),
ADD COLUMN     "municipio_origen" TEXT,
ADD COLUMN     "nombre_resp_for101" TEXT,
ADD COLUMN     "nombre_resp_tmuestra" TEXT,
ADD COLUMN     "nro_codigo_unico" TEXT,
ADD COLUMN     "nro_cuadricula" TEXT,
ADD COLUMN     "nro_matricula_seprec" TEXT,
ADD COLUMN     "nro_nim" TEXT NOT NULL,
ADD COLUMN     "nro_personeria" TEXT,
ADD COLUMN     "nro_res_ministerial" INTEGER,
ADD COLUMN     "nro_ruex" TEXT,
ADD COLUMN     "tel_fijo" TEXT,
ADD COLUMN     "tipo_doc_creacion" INTEGER,
ADD COLUMN     "tipo_explotacion" INTEGER,
ADD COLUMN     "tipo_operador" INTEGER NOT NULL,
ADD COLUMN     "verif_cert_liberacion" INTEGER,
DROP COLUMN "nit",
ADD COLUMN     "nit" INTEGER NOT NULL,
DROP COLUMN "nim_niar",
ADD COLUMN     "nim_niar" INTEGER NOT NULL;
