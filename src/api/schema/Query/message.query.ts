import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const MessageQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getPersonalMessage", {
      type: "message",
      args: { senderID: nonNull(idArg()), receiverID: nonNull(idArg()) },
      resolve: async (_, { receiverID, senderID }): Promise<any> => {
        return await prisma.message.findMany({
          where: {
            OR: [
              { senderID: senderID, receiverID: receiverID },
              {
                senderID: receiverID,
                receiverID: senderID,
              },
            ],
          },
        });
      },
    });
  },
});
