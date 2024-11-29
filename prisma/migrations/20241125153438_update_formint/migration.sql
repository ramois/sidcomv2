-- DropForeignKey
ALTER TABLE "FormInt" DROP CONSTRAINT "FormInt_operador_id_fkey";

-- AlterTable
ALTER TABLE "FormInt" ALTER COLUMN "nro_formulario" DROP NOT NULL,
ALTER COLUMN "operador_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FormInt" ADD CONSTRAINT "FormInt_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
