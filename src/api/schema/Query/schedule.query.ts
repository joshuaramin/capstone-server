import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ScheduleQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllSchedule", {
      type: "schedule",
      args: { input: "PaginationInput" },
      resolve: async (_, { input: { skip, take } }): Promise<any> => {
        return await prisma.schedule.findMany({
          take,
          skip,
        });
      },
    });
    t.field("getScheduleById", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()) },
      resolve: async (_, { scheduleID }): Promise<any> => {
        return await prisma.schedule.findFirst({
          where: { scheduleID },
        });
      },
    });
  },
});
