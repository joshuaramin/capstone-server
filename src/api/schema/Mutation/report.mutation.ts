import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createReportJobPost", {
      type: "report",
      args: {
        jobPostID: nonNull(idArg()),
        message: nonNull(stringArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { jobPostID, message, userID }): Promise<any> => {
        return await prisma.report.create({
          data: {
            message,
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
          },
        });
      },
    });
  },
});
