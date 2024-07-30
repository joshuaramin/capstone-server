import { extendType, idArg, inputObjectType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const PaginationInput = inputObjectType({
  name: "PaginationInput",
  definition(t) {
    t.int("take");
    t.int("page");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllUserAccountByRole", {
      type: "user",
      args: { input: "PaginationInput", role: "roleEnum" },
      resolve: async (_, { input: { take, page }, role }): Promise<any> => {
        const result = await prisma.user.findMany({
          where: {
            role,
          },
          take: take,
          skip: take * (page - 1),
        });

        return result;
      },
    });
    t.field("getSearchByUser", {
      type: "user",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.user.findMany({
          where: {
            Profile: {
              OR: [
                {
                  firstname: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  lastname: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        });
      },
    });
    t.field("getUserAccountById", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.user.findFirst({
          where: { userID },
        });
      },
    });
  },
});
