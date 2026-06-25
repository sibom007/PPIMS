/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `code` on the `Department` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "code",
ADD COLUMN     "code" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DepartmentCode";

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");
