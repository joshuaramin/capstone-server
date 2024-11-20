import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import generateRandom from "../../helpers/generateRandom";

import { ATSMainFunc } from "../../helpers/ats";
import {
  ApplicantHired,
  ApplicantPending,
  ApplicantReject,
  ApplicantReview,
} from "../../helpers/sendgrid";
import axios from "axios";

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
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "You need to submit a resume",
          };
        }

        const users = await prisma.user.findUnique({
          where: { userID },
        });

        if (users.verified === false) {
          return {
            __typename: "ErrorObject",
            code: 401,
            message: "You must verify your account to submit your application",
          };
        }

        const resume = await prisma.resume.findUnique({
          where: { resumeID },
        });

        const jobPostDesc = await prisma.jobPost.findUnique({
          where: { jobPostID },
          include: {
            Company: true,
          },
        });

        if (new Date(jobPostDesc.endDate) < new Date()) {
          return {
            __typename: "ErrorObject",
            message: "The application period has ended.",
            code: 400,
          };
        }

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
            __typename: "ErrorObject",
            code: 400,
            message: "You already applied to this application",
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
          include: {
            User: {
              include: {
                Profile: true,
              },
            },
          },
        });

        await prisma.notification.create({
          data: {
            title: `You Submitted your application to ${jobPostDesc.Company.companyName}`,
            User: {
              connect: {
                userID,
              },
            },
            Application: {
              connect: {
                applicationID: application.applicationID,
              },
            },
          },
        });

        await prisma.notification.create({
          data: {
            title: `${application.User.Profile.firstname} ${application.User.Profile.lastname} submitted an application at ${jobPostDesc.title}`,
            User: {
              connect: {
                userID: jobPostDesc.Company.userID,
              },
            },
            Application: {
              connect: {
                applicationID: application.applicationID,
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
              Application: {
                connect: {
                  applicationID: applicant.applicationID,
                },
              },
            },
          });
        } else if (status === "Hired") {
          const urlPDF = await axios.get(applicant.JobPost.agreement, {
            responseType: "arraybuffer",
          });

          const fileData = Buffer.from(urlPDF.data).toString("base64");

          ApplicantHired(
            applicant.User.email,
            `${applicant.User.Profile.firstname} ${applicant.User.Profile.lastname}`,
            `${applicant.JobPost.title}`,
            `${applicant.JobPost.Company.companyName}`,
            [
              {
                content: fileData,
                disposition: "attachment",
                filename: "Disclosure Agreement",
                type: "application/pdf",
              },
            ]
          );

          await prisma.notification.create({
            data: {
              title: `Congratulation, You are hired at ${applicant.JobPost.title}`,
              User: {
                connect: {
                  userID: applicant.userID,
                },
              },
              Application: {
                connect: {
                  applicationID: applicant.applicationID,
                },
              },
            },
          });

          await prisma.projectOrganizer.create({
            data: {
              title: applicant.JobPost.title,
              description: applicant.JobPost.description,
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
              Application: {
                connect: {
                  applicationID: applicant.applicationID,
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
