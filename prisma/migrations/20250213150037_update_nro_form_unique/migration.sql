/*
  Warnings:

  - A unique constraint covering the columns `[nro_formulario]` on the table `FormExt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nro_formulario]` on the table `FormInt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nro_formulario]` on the table `Sample` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormExt_nro_formulario_key" ON "FormExt"("nro_formulario");

-- CreateIndex
CREATE UNIQUE INDEX "FormInt_nro_formulario_key" ON "FormInt"("nro_formulario");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_nro_formulario_key" ON "Sample"("nro_formulario");
