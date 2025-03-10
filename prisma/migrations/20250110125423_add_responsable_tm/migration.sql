/*
  Warnings:

  - Made the column `responsable_tdm_id` on table `Sample` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "responsable_tdm_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "ResponsableTM" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "ci" TEXT,
    "celular" INTEGER,
    "email" TEXT,
    "operador_id" INTEGER,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponsableTM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SenarecomTM" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "ci" TEXT,
    "celular" INTEGER,
    "email" TEXT,
    "cargo" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SenarecomTM_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_responsable_tdm_id_fkey" FOREIGN KEY ("responsable_tdm_id") REFERENCES "ResponsableTM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_responsable_tdm_senarecom_id_fkey" FOREIGN KEY ("responsable_tdm_senarecom_id") REFERENCES "SenarecomTM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsableTM" ADD CONSTRAINT "ResponsableTM_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
