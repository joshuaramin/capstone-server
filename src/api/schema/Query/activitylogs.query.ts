import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ActivityLogs = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getUserActivityLogs", {
      type: "activityLogs",
      args: { userID: nonNull(idArg()), input: nonNull("PaginationInput") },
      resolve: async (_, { userID, input: { page, take } }): Promise<any> => {
        return await prisma.activityLogs.findMany({
          where: {
            userID,
          },
          take,
          skip: take * (page - 1),
        });
      },
    });
  },
});
