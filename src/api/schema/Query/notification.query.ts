import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const NotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getNotificationByUserID", {
      type: "NotificationPagination",
      args: {
        userID: nonNull(idArg()),
        cursor: stringArg(),
        limit: intArg(),
      },
      resolve: async (_, { userID, cursor, limit }): Promise<any> => {
        const queryLimit = Math.min(limit, 10);
        const notif = await prisma.notification.findMany({
          where: {
            userID,
            is_deleted: false,
          },
          take: queryLimit + 1,
          ...(cursor && {
            cursor: {
              notificationID: cursor,
            },
            skip: 1,
          }),
          orderBy: {
            createdAt: "desc",
          },
        });

        let nextCursor;

        if (notif.length > queryLimit) {
          const nextNotif = notif.pop();
          nextCursor = nextNotif!.notificationID.toString();
        }

        return {
          notification: notif,
          cursor,
        };
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
    t.int("unreadNotification", {
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }) => {
        return await prisma.notification.count({
          where: {
            userID,
            is_deleted: false,
            read: false,
          },
        });
      },
    });
  },
});
