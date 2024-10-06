import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const ScheduleObject = objectType({
  name: "schedule",
  definition(t) {
    t.id("scheduleID");
    t.string("title");
    t.string("description");
    t.string("startTime");
    t.string("endTime");
    t.datetime("startDate");
    t.datetime("endDate");
    t.string("link");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("applicant", {
      type: "user",
      resolve: async ({ scheduleID }): Promise<any> => {
        return await prisma.user.findFirst({
          where: {
            scheduleReceiver: {
              some: {
                scheduleID,
              },
            },
          },
        });
      },
    });
  },
});
