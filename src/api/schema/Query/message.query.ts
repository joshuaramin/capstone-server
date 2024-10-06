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

    t.list.field("getListofMessage", {
      type: "message",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }) => {
        return await prisma.message.findMany({
          where: {
            OR: [{ senderID: userID }, { receiverID: userID }],

            NOT: [{ senderID: userID }],
          },
          include: {
            sender: true,
          },
          distinct: ["receiverID", "senderID"],
          orderBy: {
            createdAt: "desc",
          },
        });
      },
    });

    t.list.field("getAllMyMessage", {
      type: "message",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.message.findMany({
          where: {
            OR: [{ senderID: userID }, { receiverID: userID }],
            NOT: [{ receiverID: userID }],
          },
          orderBy: {
            createdAt: "desc",
          },
          distinct: ["receiverID", "senderID"],
        });
      },
    });
  },
});
