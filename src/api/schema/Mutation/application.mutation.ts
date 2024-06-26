import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createApplication", {
      type: "application",
      args: {
        userID: nonNull(idArg()),
        jobPostID: nonNull(idArg()),
        resumeID: nonNull(idArg()),
      },
      resolve: async (_, { userID, jobPostID, resumeID }): Promise<any> => {
        return await prisma.application.create({
          data: {
            id: "",
            status: "Pending",
            ATS: {
              create: {
                score: 10,
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
