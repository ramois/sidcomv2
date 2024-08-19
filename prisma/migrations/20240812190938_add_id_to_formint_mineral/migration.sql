/*
  Warnings:

  - The primary key for the `FormIntMineral` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SampleMineral` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "FormIntMineral" DROP CONSTRAINT "FormIntMineral_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "FormIntMineral_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SampleMineral" DROP CONSTRAINT "SampleMineral_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SampleMineral_pkey" PRIMARY KEY ("id");
