/*
  Warnings:

  - Made the column `nro_formulario` on table `FormInt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FormInt" ALTER COLUMN "nro_formulario" SET NOT NULL;
