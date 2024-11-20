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
    t.field("getAllUserAccountByRole", {
      type: "UserPagination",
      args: {
        input: "PaginationInput",
        role: stringArg(),
        search: stringArg(),
      },
      resolve: async (
        _,
        { input: { take, page }, role, search }
      ): Promise<any> => {
        const result = await prisma.user.findMany({
          where: {
            role: role as any,
            isArchive: false,
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
