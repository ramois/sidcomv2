/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `FormExt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `FormInt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Sample` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `FormExt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `FormInt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Sample` table without a default value. This is not possible if the table is not empty.

*/
-- Paso 1: Añadir las columnas hash sin la restricción NOT NULL
ALTER TABLE "FormExt" ADD COLUMN "hash" TEXT;
ALTER TABLE "FormInt" ADD COLUMN "hash" TEXT;
ALTER TABLE "Sample" ADD COLUMN "hash" TEXT;

-- Paso 2: Actualizar las filas existentes con valores únicos
UPDATE "FormExt" SET "hash" = gen_random_uuid()::text;
UPDATE "FormInt" SET "hash" = gen_random_uuid()::text;
UPDATE "Sample" SET "hash" = gen_random_uuid()::text;

-- Paso 3: Añadir la restricción NOT NULL a las columnas hash
ALTER TABLE "FormExt" ALTER COLUMN "hash" SET NOT NULL;
ALTER TABLE "FormInt" ALTER COLUMN "hash" SET NOT NULL;
ALTER TABLE "Sample" ALTER COLUMN "hash" SET NOT NULL;

-- Paso 4: Crear los índices únicos en las columnas hash
CREATE UNIQUE INDEX "FormExt_hash_key" ON "FormExt"("hash");
CREATE UNIQUE INDEX "FormInt_hash_key" ON "FormInt"("hash");
CREATE UNIQUE INDEX "Sample_hash_key" ON "Sample"("hash");
;
