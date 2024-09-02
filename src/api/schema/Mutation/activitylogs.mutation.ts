import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ActivityLogsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("Logout", {
      type: "activityLogs",
      args: {
        userID: nonNull(idArg()),
      },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.activityLogs.create({
          data: {
            title: "Logged Out",
            description: "You logged out of your account.",
            User: {
              connect: { userID },
            },
          },
        });
      },
    });
  },
});
