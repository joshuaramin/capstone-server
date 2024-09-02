import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getApplicantJobPostByIdPagination", {
      type: "ApplicantPagination",
      args: { input: nonNull("PaginationInput"), jobPostID: nonNull(idArg()) },
      resolve: async (
        _,
        { input: { take, page }, jobPostID }
      ): Promise<any> => {
        const getJobPostApplicant = await prisma.application.findMany({
          where: {
            jobPostID,
          },
        });

        const offset = (page - 1) * take;
        const item = getJobPostApplicant.slice(offset, offset + take);

        return {
          totalPages: Math.ceil(getJobPostApplicant.length / take),
          totalItems: getJobPostApplicant.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getJobPostApplicant.length / take),
          hasPrevPage: page > 1,
          item,
        };
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
