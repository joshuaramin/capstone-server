import { extendInputType, extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const CompanyQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllCompanies", {
      type: "company",
      args: { input: nonNull("PaginationInput") },
      resolve: async (_, { input: { page, take } }): Promise<any> => {
        return await prisma.company.findMany({
          take,
          skip: take * (page - 1),
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
    t.field("getSearchByCompanyName", {
      type: "company",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.company.findMany({
          where: {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });
  },
});
