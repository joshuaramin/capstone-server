/*
  Warnings:

  - The primary key for the `MessageStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `messageStatus` on the `MessageStatus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyID]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - The required column `messageStatusID` was added to the `MessageStatus` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `description` to the `ProjectOrganizer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageStatus" DROP CONSTRAINT "MessageStatus_pkey",
DROP COLUMN "messageStatus",
ADD COLUMN     "messageStatusID" TEXT NOT NULL,
ADD CONSTRAINT "MessageStatus_pkey" PRIMARY KEY ("messageStatusID");

-- AlterTable
ALTER TABLE "ProjectOrganizer" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Subscription" (
    "subscriptionID" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userID" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionID")
);

-- CreateTable
CREATE TABLE "_NotificationToSchedule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userID_key" ON "Subscription"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "_NotificationToSchedule_AB_unique" ON "_NotificationToSchedule"("A", "B");

-- CreateIndex
CREATE INDEX "_NotificationToSchedule_B_index" ON "_NotificationToSchedule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Media_companyID_key" ON "Media"("companyID");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToSchedule" ADD CONSTRAINT "_NotificationToSchedule_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToSchedule" ADD CONSTRAINT "_NotificationToSchedule_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("scheduleID") ON DELETE CASCADE ON UPDATE CASCADE;
