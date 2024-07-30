import {
  extendType,
  idArg,
  intArg,
  list,
  nonNull,
  nullable,
  stringArg,
} from "nexus";
import { prisma } from "../../helpers/server";

export const JobPostQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllJobPost", {
      type: "jobpost",
      args: {
        input: nonNull("PaginationInput"),
      },
      resolve: async (_, { input: { page, take } }): Promise<any> => {
        return await prisma.jobPost.findMany({
          take,
          skip: take * (page - 1),
          where: {
            NOT: {
              OR: [
                {
                  isArchive: true,
                },
                {
                  isDraft: true,
                },
              ],
            },
          },
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
      args: {
        search: nonNull(stringArg()),
        pagination: nonNull("PaginationInput"),
      },
      resolve: async (
        _,
        { search, pagination: { take, page } }
      ): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: {
            title: {
              contains: search,
              mode: "insensitive",
            },
            NOT: {
              isArchive: true,
              isDraft: true,
            },
          },
          take,
          skip: take * (page - 1),
        });
      },
    });
  },
});
