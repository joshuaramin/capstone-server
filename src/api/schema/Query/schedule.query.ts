import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ScheduleQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getScheduleById", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()) },
      resolve: async (_, { scheduleID }): Promise<any> => {
        return await prisma.schedule.findFirst({
          where: { scheduleID },
        });
      },
    });
    t.list.field("getScheduleByDate", {
      type: "schedule",
      args: { date: nonNull(stringArg()), userID: nonNull(idArg()) },
      resolve: async (_, { date, userID }): Promise<any> => {
        return await prisma.schedule.findMany({
          where: {
            startDate: new Date(date),
            senderID: userID,
          },
        });
      },
    });
    t.list.field("getReceiverByDate", {
      type: "schedule",
      args: { date: nonNull(stringArg()), userID: nonNull(idArg()) },
      resolve: async (_, { date, userID }): Promise<any> => {
        return await prisma.schedule.findMany({
          where: {
            startDate: new Date(date),
            receiverID: userID,
          },
        });
      },
    });
  },
});
