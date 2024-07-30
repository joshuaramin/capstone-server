import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getJobApplicationById", {
      type: "application",
      args: {
        jobPostID: nonNull(idArg()),
        pagination: nonNull("PaginationInput"),
      },
      resolve: async (
        _,
        { jobPostID, pagination: { page, take } }
      ): Promise<any> => {
        return await prisma.application.findMany({
          where: { jobPostID },
          take,
          skip: take * (page - 1),
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
