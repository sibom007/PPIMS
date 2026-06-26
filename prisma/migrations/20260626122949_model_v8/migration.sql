/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `StudentApplication` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `departmentId` to the `StudentApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StudentApplication` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `StudentApplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `StudentApplication` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gender` to the `TeacherApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "StudentApplication" ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "TeacherApplication" ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_userId_key" ON "StudentApplication"("userId");

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
