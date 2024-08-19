-- CreateTable
CREATE TABLE "FormInt" (
    "id" SERIAL NOT NULL,
    "id_operador" INTEGER NOT NULL,
    "lotes" TEXT NOT NULL,
    "presentacion" INTEGER NOT NULL,
    "cantidad" INTEGER,
    "peso_neto" DECIMAL(65,30) NOT NULL,
    "tara" INTEGER,
    "humedad" INTEGER,
    "merma" INTEGER,
    "id_municipio_origen" TEXT NOT NULL,
    "des_tipo" INTEGER NOT NULL,
    "des_comprador" TEXT,
    "des_planta" TEXT,
    "id_municipio_destino" TEXT NOT NULL,
    "tipo_transporte" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "nom_conductor" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "nro_viajes" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "FormInt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormIntMineral" (
    "formIntId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,
    "ley" INTEGER,
    "unidad" TEXT,

    CONSTRAINT "FormIntMineral_pkey" PRIMARY KEY ("formIntId","mineralId")
);

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMineral" ADD CONSTRAINT "FormIntMineral_formIntId_fkey" FOREIGN KEY ("formIntId") REFERENCES "FormInt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMineral" ADD CONSTRAINT "FormIntMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
