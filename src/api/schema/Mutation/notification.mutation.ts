import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const NotificationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateNotification", {
      type: "notification",
      args: { notificationID: nonNull(idArg()) },
      resolve: async (_, { notificationID }): Promise<any> => {
        return await prisma.notification.update({
          data: { read: true },
          where: { notificationID },
        });
      },
    });
  },
});
