-- CreateTable
CREATE TABLE "Municipios" (
    "id" SERIAL NOT NULL,
    "municipio" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "Municipios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "latitud" DECIMAL(65,30) NOT NULL,
    "longitud" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Municipios" ADD CONSTRAINT "Municipios_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
