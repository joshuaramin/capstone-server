import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import generateRandom from "../../helpers/generateRandom";
import {
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_FORBIDDEN,
} from "../../helpers/error";
import { ATSMainFunc } from "../../helpers/ats";
import {
  ApplicantHired,
  ApplicantInterview,
  ApplicantPending,
  ApplicantReject,
  ApplicantReview,
} from "../../helpers/sendgrid";

export const ApplicationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createApplication", {
      type: "ApplicationPayload",
      args: {
        userID: nonNull(idArg()),
        jobPostID: nonNull(idArg()),
        resumeID: nonNull(idArg()),
      },
      resolve: async (_, { userID, jobPostID, resumeID }): Promise<any> => {
        //check if the user is verified

        if (!resumeID) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const users = await prisma.user.findUnique({
          where: { userID },
        });

        if (users.verified === false) {
          return ERROR_MESSAGE_FORBIDDEN;
        }

        const resume = await prisma.resume.findUnique({
          where: { resumeID },
        });

        const jobPostDesc = await prisma.jobPost.findUnique({
          where: { jobPostID },
        });

        const applied = await prisma.jobPost.findUnique({
          where: {
            jobPostID,
            Application: {
              some: {
                userID,
              },
            },
          },
        });

        if (applied) {
          return {
            __typename: "AlreadyExist",
            code: 400,
            message: "Application already exist",
          };
        }

        const application = await prisma.application.create({
          data: {
            id: generateRandom(8),
            status: "Pending",
            ATS: {
              create: {
                score: await ATSMainFunc(
                  resume.resume,
                  jobPostDesc.description
                ),
              },
            },
            JobPost: {
              connect: {
                jobPostID,
              },
            },
            User: {
              connect: {
                userID,
              },
            },
            Resume: {
              connect: {
                resumeID,
              },
            },
          },
        });

        await prisma.notification.create({
          data: {
            title: `You Submitted your application to ${jobPostDesc.title}`,
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Created a Application",
            description: `You sent an Application to ${jobPostDesc.title}`,
            User: { connect: { userID } },
          },
        });

        return {
          __typename: "application",
          ...application,
        };
      },
    });
    t.field("updateApplicationStatus", {
      type: "application",
      args: { applicationID: nonNull(idArg()), status: nonNull(stringArg()) },
      resolve: async (_, { applicationID, status }): Promise<any> => {
        const applicant = await prisma.application.update({
          where: { applicationID },
          data: {
            status,
          },
          include: {
            User: {
              include: {
                Profile: true,
              },
            },
            JobPost: {
              include: {
                Company: true,
                Salary: true,
              },
            },
          },
        });

        if (status === "Pending") {
          ApplicantPending(
            applicant.User.email,
            `${applicant.User.Profile.firstname} ${applicant.User.Profile.lastname}`,
            `${applicant.JobPost.title}`,
            `${applicant.JobPost.Company.companyName}`
          );
        } else if (status == "Review") {
          ApplicantReview(
            applicant.User.email,
            `${applicant.User.Profile.firstname} ${applicant.User.Profile.lastname}`,
            `${applicant.JobPost.title}`,
            `${applicant.JobPost.Company.companyName}`
          );

          await prisma.notification.create({
            data: {
              title: `Your Application is on the Under Review`,
              User: {
                connect: {
                  userID: applicant.userID,
                },
              },
            },
          });
        } else if (status === "Hired") {
          ApplicantHired(
            applicant.User.email,
            `${applicant.User.Profile.firstname} ${applicant.User.Profile.lastname}`,
            `${applicant.JobPost.title}`,
            `${applicant.JobPost.Company.companyName}`
          );

          await prisma.notification.create({
            data: {
              title: `Congratulation, You are hired at ${applicant.JobPost.title}`,
              User: {
                connect: {
                  userID: applicant.userID,
                },
              },
            },
          });

          await prisma.projectOrganizer.create({
            data: {
              amount:
                applicant.JobPost.Salary.fixed ?? applicant.JobPost.Salary.min,
              startDate: new Date(Date.now()),
              endDate: new Date(Date.now()),
              status: "Not Started",
              Company: {
                connect: {
                  companyID: applicant.JobPost.companyID,
                },
              },
              User: {
                connect: {
                  userID: applicant.userID,
                },
              },
            },
          });
        } else if (status === "Rejected") {
          ApplicantReject(
            applicant.User.email,
            `${applicant.User.Profile.firstname} ${applicant.User.Profile.lastname}`,
            `${applicant.JobPost.title}`,
            `${applicant.JobPost.Company.companyName}`
          );
          await prisma.notification.create({
            data: {
              title: `Your Application at ${applicant.JobPost.title} is Declined`,
              User: {
                connect: {
                  userID: applicant.userID,
                },
              },
            },
          });
        }

        return applicant;
      },
    });
    t.list.field("generateApplicantByJobPostID", {
      type: "application",
      args: {
        jobPostID: nonNull(idArg()),
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
      },
      resolve: async (_, { jobPostID, startDate, endDate }): Promise<any> => {
        return await prisma.application.findMany({
          where: {
            jobPostID,
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        });
      },
    });
  },
});
