import {
  booleanArg,
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
        archive: booleanArg(),
      },
      resolve: async (
        _,
        { search, userID, pagination: { take, page }, archive }
      ): Promise<any> => {
        const getAlljobs = await prisma.jobPost.findMany({
          where: {
            title: {
              contains: search,
              mode: "insensitive",
            },
            isArchive: archive,
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
        filter: nonNull(stringArg()),
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
          filter,
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

        let queryParams = {
          where: whereArr,
          include: {
            Skills: true,
          },
          orderBy: [
            {
              featured: "desc",
            },
            ordersBy,
          ],
        };

        const getAllJobs = await prisma.jobPost.findMany(queryParams);

        if (skills && skills.length > 0) {
          getAllJobs.sort((a, b) => {
            const aMatchCount = a.Skills.filter((skill) =>
              skills.includes(skill.skills)
            ).length;
            const bMatchCount = b.Skills.filter((skill) =>
              skills.includes(skill.skills)
            ).length;

            return bMatchCount - aMatchCount;
          });
        }

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
