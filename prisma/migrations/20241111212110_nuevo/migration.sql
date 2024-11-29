-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "celular" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "operador_id" INTEGER,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permissions" (
    "permission_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "rol_permissions_pkey" PRIMARY KEY ("permission_id","role_id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" SERIAL NOT NULL,
    "razon_social" TEXT NOT NULL,
    "nit" INTEGER NOT NULL,
    "nim_niar" INTEGER NOT NULL,
    "nro_nim" TEXT NOT NULL,
    "fecha_exp_nim" TIMESTAMP(3) NOT NULL,
    "tipo_operador" INTEGER NOT NULL,
    "nro_personeria" TEXT,
    "nro_matricula_seprec" TEXT,
    "fecha_exp_seprec" TIMESTAMP(3),
    "tipo_doc_creacion" INTEGER,
    "doc_creacion" TEXT,
    "dl_departamento" INTEGER NOT NULL,
    "dl_municipio" INTEGER NOT NULL,
    "dl_direccion" TEXT NOT NULL,
    "dl_ubicacion" TEXT NOT NULL,
    "correo_inst" TEXT,
    "tel_fijo" TEXT,
    "celular" INTEGER NOT NULL,
    "celular_2" INTEGER,
    "act_exploracion" INTEGER DEFAULT 0,
    "act_comer_interna" INTEGER DEFAULT 0,
    "act_comer_externa" INTEGER DEFAULT 0,
    "act_industrializacion" INTEGER DEFAULT 0,
    "act_tras_colas" INTEGER DEFAULT 0,
    "act_explotacion" INTEGER DEFAULT 0,
    "act_ben_concentracion" INTEGER DEFAULT 0,
    "act_refinacion" INTEGER DEFAULT 0,
    "act_fundicion" INTEGER DEFAULT 0,
    "tipo_explotacion" INTEGER,
    "denominacion_area" TEXT,
    "nro_codigo_unico" TEXT,
    "nro_cuadricula" TEXT,
    "municipio_origen" TEXT,
    "nro_ruex" TEXT,
    "verif_cert_liberacion" INTEGER,
    "nro_res_ministerial" INTEGER,
    "nombre_resp_for101" TEXT,
    "ci_resp_for101" TEXT,
    "celular_resp_for101" INTEGER,
    "correo_resp_for101" TEXT,
    "nombre_resp_tmuestra" TEXT,
    "ci_resp_tmuestra" TEXT,
    "celular_resp_tmuestra" INTEGER,
    "correo_resp_tmuestra" TEXT,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" SERIAL NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "formExtId" INTEGER,

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
    "id" SERIAL NOT NULL,
    "sampleId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,
    "ley" INTEGER NOT NULL,
    "unidad" TEXT NOT NULL,

    CONSTRAINT "SampleMineral_pkey" PRIMARY KEY ("id")
);

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
    "id" SERIAL NOT NULL,
    "formIntId" INTEGER NOT NULL,
    "mineralId" INTEGER NOT NULL,
    "ley" INTEGER,
    "unidad" TEXT,

    CONSTRAINT "FormIntMineral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_razon_social_key" ON "Operator"("razon_social");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_formExtId_key" ON "Sample"("formExtId");

-- CreateIndex
CREATE UNIQUE INDEX "FormExt_id_sample_key" ON "FormExt"("id_sample");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permissions" ADD CONSTRAINT "rol_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permissions" ADD CONSTRAINT "rol_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMineral" ADD CONSTRAINT "SampleMineral_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleMineral" ADD CONSTRAINT "SampleMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_id_sample_fkey" FOREIGN KEY ("id_sample") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMineral" ADD CONSTRAINT "FormIntMineral_formIntId_fkey" FOREIGN KEY ("formIntId") REFERENCES "FormInt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormIntMineral" ADD CONSTRAINT "FormIntMineral_mineralId_fkey" FOREIGN KEY ("mineralId") REFERENCES "Mineral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
