import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";


export const ScheduleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSchedule", {
      type: "SchedulePayload",
      args: {
        input: nonNull("ScheduleInput"),
        senderID: nonNull(stringArg()),
        receiverID: nonNull(stringArg()),
      },
      resolve: async (
        _,
        {
          input: { description, link, startDate, title, endDate },
          receiverID,
          senderID,
        }
      ): Promise<any> => {
        if (!description || !link || !startDate || !endDate || !title) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const schedule = await prisma.schedule.create({
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

        return {
          __typename: "schedule",
          ...schedule,
        };
      },
    });
    t.field("updateSchedule", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()), input: nonNull("ScheduleInput") },
      resolve: async (_, { scheduleID, input }): Promise<any> => {
        return await prisma.schedule.update({
          data: {
            ...input,
          },
          where: {
            scheduleID,
          },
        });
      },
    });
    t.field("deleteSchedule", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()) },
      resolve: async (_, { scheduleID }): Promise<any> => {
        return await prisma.schedule.delete({
          where: { scheduleID },
        });
      },
    });
  },
});
