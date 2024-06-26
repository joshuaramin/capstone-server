import { extendType, idArg, inputObjectType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const PaginationInput = inputObjectType({
  name: "PaginationInput",
  definition(t) {
    t.int("take");
    t.int("skip");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllUserAccountByRole", {
      type: "user",
      args: { input: "PaginationInput" },
      resolve: async (_, { input: { take, skip } }): Promise<any> => {
        return await prisma.user.findMany({
          take,
          skip,
        });
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