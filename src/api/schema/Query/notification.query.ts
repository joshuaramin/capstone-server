import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const NotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getNotificationByUserID", {
      type: "notification",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.notification.findMany({
          where: { userID },
        });
      },
    });
    t.field("getNotificationByID", {
      type: "notification",
      args: { notificationID: nonNull(idArg()) },
      resolve: async (_, { notificationID }): Promise<any> => {
        return await prisma.notification.findFirst({
          where: {
            notificationID,
          },
        });
      },
    });
  },
});
