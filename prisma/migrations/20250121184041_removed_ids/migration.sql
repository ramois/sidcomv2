/*
  Warnings:

  - The primary key for the `FormIntMineral` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FormIntMineral` table. All the data in the column will be lost.
  - The primary key for the `FormIntMunicipio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FormIntMunicipio` table. All the data in the column will be lost.
  - The primary key for the `SampleMineral` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SampleMineral` table. All the data in the column will be lost.
  - The primary key for the `SampleMunicipio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SampleMunicipio` table. All the data in the column will be lost.
  - The primary key for the `SampleProcedimientoMuestra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SampleProcedimientoMuestra` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormIntMineral" DROP CONSTRAINT "FormIntMineral_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FormIntMineral_pkey" PRIMARY KEY ("formIntId", "mineralId");

-- AlterTable
ALTER TABLE "FormIntMunicipio" DROP CONSTRAINT "FormIntMunicipio_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FormIntMunicipio_pkey" PRIMARY KEY ("formIntId", "municipioId");

-- AlterTable
ALTER TABLE "SampleMineral" DROP CONSTRAINT "SampleMineral_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SampleMineral_pkey" PRIMARY KEY ("sampleId", "mineralId");

-- AlterTable
ALTER TABLE "SampleMunicipio" DROP CONSTRAINT "SampleMunicipio_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SampleMunicipio_pkey" PRIMARY KEY ("sampleId", "municipioId");

-- AlterTable
ALTER TABLE "SampleProcedimientoMuestra" DROP CONSTRAINT "SampleProcedimientoMuestra_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SampleProcedimientoMuestra_pkey" PRIMARY KEY ("sampleId", "procedimientoId");
