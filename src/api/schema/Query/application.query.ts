import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getApplicantJobPostByIdPagination", {
      type: "ApplicantPagination",
      args: {
        input: nonNull("PaginationInput"),
        jobPostID: nonNull(idArg()),
        search: stringArg(),
      },
      resolve: async (
        _,
        { input: { take, page }, jobPostID, search }
      ): Promise<any> => {
        let whereArr: any = {
          jobPostID,
        };

        if (search) {
          whereArr.User = {
            OR: [
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                Profile: {
                  firstname: {
                    contains: search,
                    mode: "insensitive",
                  },
                  lastname: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          };
        }

        let queryParams = {
          where: whereArr,
        };
        const getJobPostApplicant = await prisma.application.findMany(
          queryParams
        );

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

    t.field("getMyApplication", {
      type: "ApplicantPagination",
      args: {
        userID: nonNull(idArg()),
        input: nonNull("PaginationInput"),
        status: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { userID, input: { take, page }, status }
      ): Promise<any> => {
        const applicant = await prisma.application.findMany({
          where: {
            userID,
            status,
            JobPost: {
              isNot: null,
            },
          },
          include: {
            JobPost: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = applicant.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(applicant.length / take),
          totalItems: applicant.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(applicant.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
  },
});
