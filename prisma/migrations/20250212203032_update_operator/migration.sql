/*
  Warnings:

  - You are about to drop the column `nim_niar` on the `Operator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "nim_niar",
ADD COLUMN     "tipo_nim_niar" TEXT;
