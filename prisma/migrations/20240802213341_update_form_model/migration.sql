/*
  Warnings:

  - A unique constraint covering the columns `[formExtId]` on the table `Sample` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sample" ADD COLUMN     "formExtId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Sample_formExtId_key" ON "Sample"("formExtId");

-- AddForeignKey
ALTER TABLE "FormExt" ADD CONSTRAINT "FormExt_id_sample_fkey" FOREIGN KEY ("id_sample") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
