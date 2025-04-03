-- CreateTable
CREATE TABLE "FormCola" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "operador_id" INTEGER NOT NULL,
    "lote" TEXT NOT NULL,
    "nro_formulario" TEXT NOT NULL,
    "peso_bruto_humedo" DECIMAL(65,30) NOT NULL,
    "peso_neto" DECIMAL(65,30) NOT NULL,
    "tara" DECIMAL(65,30),
    "tipo_transporte" TEXT NOT NULL,
    "placa" TEXT,
    "nom_conductor" TEXT,
    "licencia" TEXT,
    "nro_viajes" INTEGER,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoForm" NOT NULL DEFAULT 'GENERADO',
    "fecha_creacion" TIMESTAMP(3),
    "fecha_vencimiento" TIMESTAMP(3),
    "empresa_ferrea" TEXT,
    "nro_vagon" TEXT,
    "fecha_ferrea" TIMESTAMP(3),
    "hr_ferrea" TIMESTAMP(3),
    "justificacion_anulacion" TEXT,
    "destino" TEXT NOT NULL,
    "almacen" TEXT,
    "dique_cola" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "FormCola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormColaMunicipioOrigen" (
    "formColaId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "FormColaMunicipioOrigen_pkey" PRIMARY KEY ("formColaId","municipioId")
);

-- CreateTable
CREATE TABLE "FormColaMunicipioDestino" (
    "formColaId" INTEGER NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "FormColaMunicipioDestino_pkey" PRIMARY KEY ("formColaId","municipioId")
);

-- CreateTable
CREATE TABLE "FormColaMineral" (
    "formColaId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,

    CONSTRAINT "FormColaMineral_pkey" PRIMARY KEY ("formColaId","mineralId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormCola_nro_formulario_key" ON "FormCola"("nro_formulario");

-- CreateIndex
CREATE UNIQUE INDEX "FormCola_hash_key" ON "FormCola"("hash");

-- AddForeignKey
ALTER TABLE "FormCola" ADD CONSTRAINT "FormCola_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormCola" ADD CONSTRAINT "FormCola_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMunicipioOrigen" ADD CONSTRAINT "FormColaMunicipioOrigen_formColaId_fkey" FOREIGN KEY ("formColaId") REFERENCES "FormCola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMunicipioOrigen" ADD CONSTRAINT "FormColaMunicipioOrigen_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMunicipioDestino" ADD CONSTRAINT "FormColaMunicipioDestino_formColaId_fkey" FOREIGN KEY ("formColaId") REFERENCES "FormCola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMunicipioDestino" ADD CONSTRAINT "FormColaMunicipioDestino_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMineral" ADD CONSTRAINT "FormColaMineral_formColaId_fkey" FOREIGN KEY ("formColaId") REFERENCES "FormCola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormColaMineral" ADD CONSTRAINT "FormColaMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
