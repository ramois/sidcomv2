-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "Municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
