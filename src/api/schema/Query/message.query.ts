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
      args: { userID: nonNull(idArg()), search: stringArg() },
      resolve: async (_, { userID, search }) => {
        return await prisma.message.findMany({
          where: {
            OR: [{ senderID: userID }, { receiverID: userID }],
            sender: {
              Profile: {
                OR: [
                  {
                    firstname: {
                      contains: search,
                      mode: "insensitive",
                    },
                    lastname: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
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
      args: { userID: nonNull(idArg()), search: stringArg() },
      resolve: async (_, { userID, search }): Promise<any> => {
        return await prisma.message.findMany({
          where: {
            OR: [{ senderID: userID }, { receiverID: userID }],
            receiver: {
              Profile: {
                OR: [
                  {
                    firstname: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastname: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
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
