-- CreateTable
CREATE TABLE "Sample" (
    "id" SERIAL NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "ubi_geografica" TEXT NOT NULL,
    "lugar_verificacion" TEXT NOT NULL,
    "id_operador" INTEGER NOT NULL,
    "responsable" TEXT NOT NULL,
    "lotes" TEXT NOT NULL,
    "tipo_muestra" INTEGER NOT NULL,
    "presentacion" INTEGER NOT NULL,
    "sacos" INTEGER NOT NULL,
    "camiones" INTEGER NOT NULL,
    "peso_neto" DECIMAL(65,30) NOT NULL,
    "peso_parcial" DECIMAL(65,30) NOT NULL,
    "id_municipio" INTEGER NOT NULL,
    "senerecom" TEXT NOT NULL,
    "tipo_agranel" INTEGER DEFAULT 0,
    "tipo_emsacado" INTEGER DEFAULT 0,
    "tipo_lingotes" INTEGER DEFAULT 0,
    "tipo_sal" INTEGER DEFAULT 0,
    "tipo_otr" INTEGER DEFAULT 0,
    "observaciones" TEXT,
    "estado" INTEGER NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mineral" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" INTEGER NOT NULL,

    CONSTRAINT "Mineral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleMineral" (
    "sampleId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,
    "ley" INTEGER NOT NULL,
    "unidad" TEXT NOT NULL,

    CONSTRAINT "SampleMineral_pkey" PRIMARY KEY ("sampleId","mineralId")
);

-- AddForeignKey
ALTER TABLE "SampleMineral" ADD CONSTRAINT "SampleMineral_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMineral" ADD CONSTRAINT "SampleMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
