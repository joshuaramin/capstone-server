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
    t.field("markallNotificationAsRead", {
      type: "notification",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.notification.updateMany({
          data: {
            read: true,
          },
          where: {
            userID,
            read: false,
          },
        });
      },
    });
    t.field("archiveNotification", {
      type: "notification",
      args: { notificationID: nonNull(idArg()) },
      resolve: async (_, { notificationID }) => {
        return await prisma.notification.update({
          data: {
            is_deleted: true,
          },
          where: {
            notificationID,
          },
        });
      },
    });
  },
});
