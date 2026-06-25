/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joiningDate` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `designation` on the `Teacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TeacherDesignation" AS ENUM ('LECTURER', 'JUNIOR_INSTRUCTOR', 'INSTRUCTOR', 'SENIOR_INSTRUCTOR', 'CHIEF_INSTRUCTOR', 'HEAD_OF_DEPARTMENT', 'PRINCIPAL', 'VICE_PRINCIPAL');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RETIRED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "joiningDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT,
DROP COLUMN "designation",
ADD COLUMN     "designation" "TeacherDesignation" NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "TeacherApplication" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "specialization" TEXT,
    "designation" "TeacherDesignation" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentApplication" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "gender" "Gender",
    "roll" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_roll_key" ON "StudentApplication"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_registration_key" ON "StudentApplication"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_employeeId_key" ON "Teacher"("employeeId");

-- CreateIndex
CREATE INDEX "Teacher_departmentId_idx" ON "Teacher"("departmentId");

-- CreateIndex
CREATE INDEX "Teacher_employeeId_idx" ON "Teacher"("employeeId");
