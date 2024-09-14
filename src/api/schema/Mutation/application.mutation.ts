import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import generateRandom from "../../helpers/generateRandom";
import {
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_FORBIDDEN,
} from "../../helpers/error";
import { ATSMainFunc } from "../../helpers/ats";

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
        return await prisma.application.update({
          where: { applicationID },
          data: {
            status,
          },
        });
      },
    });
  },
});
