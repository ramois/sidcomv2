-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_pais_destino_id_fkey" FOREIGN KEY ("pais_destino_id") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_aduana_id_fkey" FOREIGN KEY ("aduana_id") REFERENCES "Aduana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
