import { extendType, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ScheduleInput = inputObjectType({
  name: "ScheduleInput",
  definition(t) {
    t.string("title");
    t.string("description");
    t.datetime("startDate");
    t.datetime("endDate");
    t.string("senderID");
    t.string("receiverID");
    t.string("link");
  },
});

export const ScheduleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSchedule", {
      type: "schedule",
      args: { input: nonNull("ScheduleInput") },
      resolve: async (
        _,
        {
          input: {
            description,
            link,
            receiverID,
            senderID,
            startDate,
            title,
            endDate,
          },
        }
      ): Promise<any> => {
        return await prisma.schedule.create({
          data: {
            link,
            startDate,
            endDate,
            description,
            title,
            senderID,
            receiverID,
          },
        });
      },
    });
  },
});
