import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ActivityLogs = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserActivityLogs", {
      type: "ActivityLogsPagination",
      args: { userID: nonNull(idArg()), input: nonNull("PaginationInput") },
      resolve: async (_, { userID, input: { page, take } }): Promise<any> => {
        const result = await prisma.activityLogs.findMany({
          where: {
            userID,
          },
          orderBy: {
            createdAt: "desc",
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
  },
});
