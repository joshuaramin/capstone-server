/*
  Warnings:

  - The values [employee] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `JobPost` table. All the data in the column will be lost.
  - You are about to drop the column `default` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('Entry', 'Intermediate', 'Expert', 'Senior');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'recruiter', 'freelance');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "slug" VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "amount",
DROP COLUMN "default",
ADD COLUMN     "duration" VARCHAR(300) NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP NOT NULL,
ADD COLUMN     "experience" "ExperienceLevel" NOT NULL,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" VARCHAR(100) NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "birthday" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" VARCHAR(100);

-- CreateTable
CREATE TABLE "Requirements" (
    "requirementsID" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "type" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,
    "companyID" TEXT,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("requirementsID")
);

-- CreateTable
CREATE TABLE "ResetPassword" (
    "resetPassID" TEXT NOT NULL,
    "reset" VARCHAR(200) NOT NULL,
    "expiredAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("resetPassID")
);

-- CreateTable
CREATE TABLE "Salary" (
    "salaryID" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobPostID" TEXT,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("salaryID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Salary_jobPostID_key" ON "Salary"("jobPostID");

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetPassword" ADD CONSTRAINT "ResetPassword_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_jobPostID_fkey" FOREIGN KEY ("jobPostID") REFERENCES "JobPost"("jobPostID") ON DELETE SET NULL ON UPDATE CASCADE;
