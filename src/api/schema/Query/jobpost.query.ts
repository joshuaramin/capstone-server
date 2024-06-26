import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const JobPostQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllJobPost", {
      type: "jobpost",
      args: { input: nonNull("PaginationInput") },
      resolve: async (_, { input: { skip, take } }): Promise<any> => {
        return await prisma.jobPost.findMany({
          take,
          skip,
        });
      },
    });
    t.field("getJobPostById", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()) },
      resolve: async (_, { jobPostID }): Promise<any> => {
        return await prisma.jobPost.findFirst({
          where: { jobPostID },
        });
      },
    });
    t.list.field("getSearchByTitle", {
      type: "jobpost",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });
  },
});
