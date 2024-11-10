import { extendInputType, extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const CompanyQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAllCompanies", {
      type: "CompaniesPagination",
      args: { input: nonNull("PaginationInput"), search: stringArg() },
      resolve: async (_, { input: { page, take }, search }): Promise<any> => {
        const result = await prisma.company.findMany({
          take,
          skip: take * (page - 1),
          where: {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
        });

        const offset = (page - 1) * take;

        const item = result.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(result.length / take),
          totalItems: result.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(result.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
    t.field("getCompanySlug", {
      type: "company",
      args: { slug: nonNull(stringArg()) },
      resolve: async (_, { slug }) => {
        return await prisma.company.findFirst({
          where: {
            slug,
          },
        });
      },
    });
    t.field("getCompanyByID", {
      type: "company",
      args: { companyID: nonNull(idArg()) },
      resolve: async (_, { companyID }): Promise<any> => {
        return await prisma.company.findFirst({
          where: { companyID },
        });
      },
    });
    t.field("getMyCompanyByUserID", {
      type: "company",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.company.findFirst({
          where: {
            User: {
              userID,
            },
          },
        });
      },
    });
  },
});
