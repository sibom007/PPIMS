/*
  Warnings:

  - Changed the type of `code` on the `Department` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DepartmentCode" AS ENUM ('COMPUTER', 'CIVIL', 'ELECTRICAL', 'ELECTRONICS', 'RAC');

-- DropIndex
DROP INDEX "Department_code_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "code",
ADD COLUMN     "code" "DepartmentCode" NOT NULL;
