/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TeacherApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departmentId` to the `TeacherApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TeacherApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherApplication" ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherApplication_userId_key" ON "TeacherApplication"("userId");

-- AddForeignKey
ALTER TABLE "TeacherApplication" ADD CONSTRAINT "TeacherApplication_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherApplication" ADD CONSTRAINT "TeacherApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
