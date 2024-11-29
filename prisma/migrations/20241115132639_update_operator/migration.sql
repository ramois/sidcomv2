/*
  Warnings:

  - Made the column `hash` on table `Operator` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Operator" ALTER COLUMN "hash" SET NOT NULL;
