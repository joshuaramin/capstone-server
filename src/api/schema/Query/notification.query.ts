import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const NotificationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getNotificationByUserID", {
      type: "notification",
      args: {
        userID: nonNull(idArg()),
        pagination: nonNull("PaginationInput"),
      },
      resolve: async (
        _,
        { userID, pagination: { take, page } }
      ): Promise<any> => {
        return await prisma.notification.findMany({
          where: { userID },
          take,
          skip: take * (page - 1),
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
