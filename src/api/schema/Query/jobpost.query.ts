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
                  status: "Draft",
                },
              ],
            },
          },
        });
      },
    });
    t.field("jobPagination", {
      type: "JobPagination",
      args: {
        search: stringArg(),
        userID: nonNull(idArg()),
        pagination: "PaginationInput",
      },
      resolve: async (
        _,
        { search, userID, pagination: { take, page } }
      ): Promise<any> => {
        const getAlljobs = await prisma.jobPost.findMany({
          where: {
            title: {
              contains: search,
              mode: "insensitive",
            },
            Company: {
              userID,
            },
          },
        });

        const offset = (page - 1) * take;
        const item = getAlljobs.slice(offset, offset + take);
        return {
          totalPages: Math.ceil(getAlljobs.length / take),
          totalItems: getAlljobs.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getAlljobs.length / take),
          hasPrevPage: page > 1,
          item,
        };
      },
    });
    t.field("getJobBoard", {
      type: "JobPagination",
      args: {
        search: stringArg(),
        orderBy: stringArg(),
        input: nonNull("PaginationInput"),
        skills: list(stringArg()),
        jobType: list(stringArg()),
        experience: list(stringArg()),
        duration: list(stringArg()),
      },
      resolve: async (
        _,
        {
          input: { page, take },
          search,
          skills,
          jobType,
          experience,
          duration,
          orderBy,
        }
      ): Promise<any> => {
        let whereArr: any = {
          NOT: {
            OR: [
              {
                status: "Draft",
              },
              {
                isArchive: true,
              },
            ],
          },
        };

        let ordersBy: any = {
          createdAt: orderBy,
        };

        if (search) {
          whereArr = {
            title: { contains: search, mode: "insensitive" },
          };
        }

        if (experience) {
          whereArr = {
            experience: {
              in: experience,
            },
          };
        }

        if (duration) {
          whereArr = {
            duration: {
              in: duration,
            },
          };
        }

        if (jobType) {
          whereArr = {
            JobType: {
              hasSome: jobType,
            },
          };
        }

        if (skills) {
          whereArr = {
            Skills: {
              some: {
                skills: {
                  in: skills,
                },
              },
            },
          };
        }

        let queryParams = {
          where: whereArr,
          orderBy: ordersBy,
        };

        const getAllJobs = await prisma.jobPost.findMany(queryParams);

        const offset = (page - 1) * take;
        const item = getAllJobs.slice(offset, offset + take);
        return {
          totalPages: Math.ceil(getAllJobs.length / take),
          totalItems: getAllJobs.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getAllJobs.length / take),
          hasPrevPage: page > 1,
          item,
        };
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
    t.list.field("getMyCompanyJobPost", {
      type: "jobpost",
      args: { userID: nonNull(idArg()), pagination: "PaginationInput" },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: {
            Company: {
              userID,
            },
          },
        });
      },
    });
    t.field("getJobPostBySlug", {
      type: "jobpost",
      args: { slug: nonNull(idArg()) },
      resolve: async (_, { slug }): Promise<any> => {
        return await prisma.jobPost.findFirst({
          where: {
            slug,
          },
        });
      },
    });
    t.list.field("getSimilarJobPost", {
      type: "jobpost",
      args: {
        jobPostID: nonNull(idArg()),
        skills: nonNull(list(stringArg())),
        input: nonNull("PaginationInput"),
      },
      resolve: async (
        _,
        { jobPostID, skills, input: { page, take } }
      ): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: {
            Skills: {
              some: {
                skills: {
                  in: skills,
                },
              },
            },
            NOT: {
              jobPostID,
            },
          },
          take,
          skip: (page - 1) * take,
        });
      },
    });
  },
});
