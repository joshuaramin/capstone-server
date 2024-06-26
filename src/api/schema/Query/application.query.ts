import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getJobApplicationBYId", {
      type: "application",
      args: { jobPostID: nonNull(idArg()) },
      resolve: async (_, { jobPostID }): Promise<any> => {
        return await prisma.application.findMany({
          where: { jobPostID },
        });
      },
    });
    t.field("getApplicationByID", {
      type: "application",
      args: { applicationID: nonNull(idArg()) },
      resolve: async (_, { applicationID }): Promise<any> => {
        return await prisma.application.findFirst({
          where: {
            applicationID,
          },
        });
      },
    });
  },
});
