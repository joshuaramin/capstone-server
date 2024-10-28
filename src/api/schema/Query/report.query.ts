import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAllJobPostReport", {
      type: "ReportPagination",
      args: { input: nonNull("PaginationInput") },
      resolve: async (_, { input: { take, page } }): Promise<any> => {
        const results = await prisma.report.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = results.slice(offset, offset + take);
        return {
          item,
          totalPages: Math.ceil(results.length / take),
          totalItems: results.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(results.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
    t.field("getReportById", {
      type: "report",
      args: { reportID: nonNull(idArg()) },
      resolve: async (_, { reportID }) => {
        return await prisma.report.findFirst({
          where: {
            reportID,
          },
        });
      },
    });
  },
});
