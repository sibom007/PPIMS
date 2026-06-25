-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
