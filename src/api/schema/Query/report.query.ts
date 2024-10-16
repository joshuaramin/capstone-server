import { extendType } from "nexus";
import { prisma } from "../../helpers/server";

export const ReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllJobPostReport", {
      type: "ReportPagination",
      resolve: async (): Promise<any> => {
        const reports = await prisma.jobPost.findMany({
            where: {}
        })
      },
    });
  },
});
