-- AlterTable
ALTER TABLE "Sample" ALTER COLUMN "fecha_emision" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "FormExt" (
    "id" SERIAL NOT NULL,
    "id_sample" INTEGER NOT NULL,
    "m03" TEXT NOT NULL,
    "nro_factura_exportacion" INTEGER NOT NULL,
    "laboratorio" TEXT NOT NULL,
    "cod_analisis" INTEGER NOT NULL,
    "des_comprador" TEXT NOT NULL,
    "des_aduana" TEXT NOT NULL,
    "des_pais" TEXT NOT NULL,
    "tipo_transporte" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "nom_conductor" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "FormExt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormExt_id_sample_key" ON "FormExt"("id_sample");
