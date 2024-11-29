/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Operator` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Operator" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Operator_hash_key" ON "Operator"("hash");
