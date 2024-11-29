-- CreateTable
CREATE TABLE "Presentacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "humedad" INTEGER NOT NULL,
    "merma" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Presentacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuracionForm" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dias" INTEGER NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuracionForm_pkey" PRIMARY KEY ("id")
);
