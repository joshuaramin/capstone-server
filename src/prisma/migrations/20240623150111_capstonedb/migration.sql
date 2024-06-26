-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'employee', 'freelance');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" VARCHAR(300) NOT NULL,
    "password" VARCHAR(300) NOT NULL,
    "role" "Role" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationID" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageID")
);

-- CreateTable
CREATE TABLE "Company" (
    "companyID" TEXT NOT NULL,
    "companyName" VARCHAR(300) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "location" VARCHAR(300) NOT NULL,
    "companySize" VARCHAR(300) NOT NULL,
    "userID" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyID")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profielID" TEXT NOT NULL,
    "firstname" VARCHAR(256) NOT NULL,
    "lastname" VARCHAR(256) NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profielID")
);

-- CreateTable
CREATE TABLE "About" (
    "aboutID" TEXT NOT NULL,
    "bio" VARCHAR(300),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileID" TEXT,

    CONSTRAINT "About_pkey" PRIMARY KEY ("aboutID")
);

-- CreateTable
CREATE TABLE "Skills" (
    "skillsID" TEXT NOT NULL,
    "skills" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutID" TEXT,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("skillsID")
);

-- CreateTable
CREATE TABLE "Media" (
    "mediaID" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolio" TEXT,
    "profileID" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("mediaID")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "portfolioID" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "employmentType" VARCHAR(300) NOT NULL,
    "companyName" VARCHAR(300) NOT NULL,
    "location" VARCHAR(300) NOT NULL,
    "locationType" VARCHAR(300) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("portfolioID")
);

-- CreateTable
CREATE TABLE "Resume" (
    "resumeID" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileID" TEXT,
    "applicationID" TEXT,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("resumeID")
);

-- CreateTable
CREATE TABLE "PasswordHash" (
    "passowrdID" TEXT NOT NULL,
    "passHash" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "PasswordHash_pkey" PRIMARY KEY ("passowrdID")
);

-- CreateTable
CREATE TABLE "JobPost" (
    "jobPostID" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "keyword" TEXT[],
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyID" TEXT,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("jobPostID")
);

-- CreateTable
CREATE TABLE "Application" (
    "applicationID" TEXT NOT NULL,
    "id" VARCHAR(20) NOT NULL,
    "status" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobPostID" TEXT,
    "userID" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("applicationID")
);

-- CreateTable
CREATE TABLE "ActivityLogs" (
    "logsID" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY ("logsID")
);

-- CreateTable
CREATE TABLE "ApplicationScore" (
    "applicationScoreID" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationID" TEXT,

    CONSTRAINT "ApplicationScore_pkey" PRIMARY KEY ("applicationScoreID")
);

-- CreateTable
CREATE TABLE "Archive" (
    "archiveID" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("archiveID")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "scheduleID" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" VARCHAR(300),
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleID")
);

-- CreateTable
CREATE TABLE "_PortfolioToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userID_key" ON "Company"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "About_profileID_key" ON "About"("profileID");

-- CreateIndex
CREATE UNIQUE INDEX "Media_profileID_key" ON "Media"("profileID");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_applicationID_key" ON "Resume"("applicationID");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationScore_applicationID_key" ON "ApplicationScore"("applicationID");

-- CreateIndex
CREATE UNIQUE INDEX "_PortfolioToSkills_AB_unique" ON "_PortfolioToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_PortfolioToSkills_B_index" ON "_PortfolioToSkills"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "About" ADD CONSTRAINT "About_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profielID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_aboutID_fkey" FOREIGN KEY ("aboutID") REFERENCES "About"("aboutID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_portfolio_fkey" FOREIGN KEY ("portfolio") REFERENCES "Portfolio"("portfolioID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profielID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profielID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_applicationID_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application"("applicationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHash" ADD CONSTRAINT "PasswordHash_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobPostID_fkey" FOREIGN KEY ("jobPostID") REFERENCES "JobPost"("jobPostID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLogs" ADD CONSTRAINT "ActivityLogs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationScore" ADD CONSTRAINT "ApplicationScore_applicationID_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application"("applicationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioToSkills" ADD CONSTRAINT "_PortfolioToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Portfolio"("portfolioID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioToSkills" ADD CONSTRAINT "_PortfolioToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("skillsID") ON DELETE CASCADE ON UPDATE CASCADE;
