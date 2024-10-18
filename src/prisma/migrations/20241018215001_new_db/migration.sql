/*
  Warnings:

  - You are about to alter the column `score` on the `ApplicationScore` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `isDraft` on the `JobPost` table. All the data in the column will be lost.
  - You are about to drop the column `profileID` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `applicationID` on the `Resume` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarID]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[headerID]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skills]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMonth` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `Portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProjectOrganizer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_profileID_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_applicationID_fkey";

-- DropForeignKey
ALTER TABLE "Skills" DROP CONSTRAINT "Skills_profileID_fkey";

-- DropIndex
DROP INDEX "Media_profileID_key";

-- DropIndex
DROP INDEX "Resume_applicationID_key";

-- AlterTable
ALTER TABLE "About" ALTER COLUMN "bio" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "ApplicationScore" ALTER COLUMN "score" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "isDraft",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" VARCHAR(200) NOT NULL,
ALTER COLUMN "isOpen" DROP DEFAULT,
ALTER COLUMN "isOpen" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "profileID";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endMonth" VARCHAR(100),
ADD COLUMN     "endYear" VARCHAR(100),
ADD COLUMN     "startMonth" VARCHAR(100) NOT NULL,
ADD COLUMN     "startYear" VARCHAR(100) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarID" TEXT,
ADD COLUMN     "fontFontID" TEXT,
ADD COLUMN     "headerID" TEXT;

-- AlterTable
ALTER TABLE "ProjectOrganizer" ADD COLUMN     "title" VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "applicationID",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Salary" ALTER COLUMN "fixed" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "endTime" VARCHAR(50) NOT NULL,
ADD COLUMN     "startTime" VARCHAR(50) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "zintegration" (
    "integrationID" TEXT NOT NULL,
    "accountID" TEXT NOT NULL,
    "clientID" TEXT NOT NULL,
    "secretID" TEXT NOT NULL,
    "userID" TEXT,

    CONSTRAINT "zintegration_pkey" PRIMARY KEY ("integrationID")
);

-- CreateTable
CREATE TABLE "MessageStatus" (
    "messageStatus" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "messageID" TEXT,
    "userID" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageStatus_pkey" PRIMARY KEY ("messageStatus")
);

-- CreateTable
CREATE TABLE "Social" (
    "socialID" TEXT NOT NULL,
    "instagram" TEXT,
    "facebook" TEXT,
    "Github" TEXT,
    "X" TEXT,
    "Web" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileID" TEXT,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("socialID")
);

-- CreateTable
CREATE TABLE "Theme" (
    "themeID" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("themeID")
);

-- CreateTable
CREATE TABLE "Font" (
    "fontID" TEXT NOT NULL,
    "font" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Font_pkey" PRIMARY KEY ("fontID")
);

-- CreateTable
CREATE TABLE "Education" (
    "educationID" TEXT NOT NULL,
    "school" VARCHAR(500) NOT NULL,
    "degree" VARCHAR(200) NOT NULL,
    "study" VARCHAR(300) NOT NULL,
    "startMonth" VARCHAR(100) NOT NULL,
    "startYear" VARCHAR(100) NOT NULL,
    "endMonth" VARCHAR(100),
    "endYear" VARCHAR(100),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileID" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("educationID")
);

-- CreateTable
CREATE TABLE "_NotificationToProjectOrganizer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyToNotification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfileToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfileToTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MediaToMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EducationToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToResume" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToNotification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "zintegration_userID_key" ON "zintegration"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Social_profileID_key" ON "Social"("profileID");

-- CreateIndex
CREATE UNIQUE INDEX "_NotificationToProjectOrganizer_AB_unique" ON "_NotificationToProjectOrganizer"("A", "B");

-- CreateIndex
CREATE INDEX "_NotificationToProjectOrganizer_B_index" ON "_NotificationToProjectOrganizer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToNotification_AB_unique" ON "_CompanyToNotification"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToNotification_B_index" ON "_CompanyToNotification"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToSkills_AB_unique" ON "_ProfileToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToSkills_B_index" ON "_ProfileToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToTheme_AB_unique" ON "_ProfileToTheme"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToTheme_B_index" ON "_ProfileToTheme"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToMessage_AB_unique" ON "_MediaToMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToMessage_B_index" ON "_MediaToMessage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EducationToSkills_AB_unique" ON "_EducationToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_EducationToSkills_B_index" ON "_EducationToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToResume_AB_unique" ON "_ApplicationToResume"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToResume_B_index" ON "_ApplicationToResume"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToNotification_AB_unique" ON "_ApplicationToNotification"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToNotification_B_index" ON "_ApplicationToNotification"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_avatarID_key" ON "Profile"("avatarID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_headerID_key" ON "Profile"("headerID");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_skills_key" ON "Skills"("skills");

-- AddForeignKey
ALTER TABLE "zintegration" ADD CONSTRAINT "zintegration_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageStatus" ADD CONSTRAINT "MessageStatus_messageID_fkey" FOREIGN KEY ("messageID") REFERENCES "Message"("messageID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageStatus" ADD CONSTRAINT "MessageStatus_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_avatarID_fkey" FOREIGN KEY ("avatarID") REFERENCES "Media"("mediaID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_headerID_fkey" FOREIGN KEY ("headerID") REFERENCES "Media"("mediaID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_fontFontID_fkey" FOREIGN KEY ("fontFontID") REFERENCES "Font"("fontID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profileID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Font" ADD CONSTRAINT "Font_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profileID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToProjectOrganizer" ADD CONSTRAINT "_NotificationToProjectOrganizer_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToProjectOrganizer" ADD CONSTRAINT "_NotificationToProjectOrganizer_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectOrganizer"("projectOrganizerID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToNotification" ADD CONSTRAINT "_CompanyToNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("companyID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToNotification" ADD CONSTRAINT "_CompanyToNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToSkills" ADD CONSTRAINT "_ProfileToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("profileID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToSkills" ADD CONSTRAINT "_ProfileToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("skillsID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTheme" ADD CONSTRAINT "_ProfileToTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("profileID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTheme" ADD CONSTRAINT "_ProfileToTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "Theme"("themeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMessage" ADD CONSTRAINT "_MediaToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("mediaID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMessage" ADD CONSTRAINT "_MediaToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("messageID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducationToSkills" ADD CONSTRAINT "_EducationToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Education"("educationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducationToSkills" ADD CONSTRAINT "_EducationToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("skillsID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("applicationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_B_fkey" FOREIGN KEY ("B") REFERENCES "Resume"("resumeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToNotification" ADD CONSTRAINT "_ApplicationToNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("applicationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToNotification" ADD CONSTRAINT "_ApplicationToNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;
