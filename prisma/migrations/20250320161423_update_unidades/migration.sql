/*
  Warnings:

  - You are about to drop the column `nro_cuadricula` on the `Arrendamiento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Arrendamiento" DROP COLUMN "nro_cuadricula",
ADD COLUMN     "extension" DECIMAL(65,30),
ADD COLUMN     "unidad_extension" TEXT;

-- AlterTable
ALTER TABLE "FormExt" ALTER COLUMN "humedad" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "merma" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "tara" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "FormInt" ALTER COLUMN "tara" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "humedad" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "merma" SET DATA TYPE DECIMAL(65,30);
