-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
