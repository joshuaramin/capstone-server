import { extendType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const MessageMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createMessage", {
      type: "message",
      args: {
        message: nonNull(stringArg()),
        senderID: nonNull(stringArg()),
        receiverID: nonNull(stringArg()),
      },
      resolve: async (_, { message, receiverID, senderID }): Promise<any> => {
        return await prisma.message.create({
          data: {
            message,
            senderID,
            receiverID,
          },
        });
      },
    });
    t.field("updateMessage", {
      type: "message",
      args: { messageID: nonNull(stringArg()), message: nonNull(stringArg()) },
      resolve: async (_, { messageID, message }): Promise<any> => {
        return await prisma.message.update({
          where: {
            messageID,
          },
          data: {
            message,
          },
        });
      },
    });
  },
});
