import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { groupBy } from "lodash";
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
    t.field("getUnreadCountMessage", {
      type: "Int",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        const hello = await prisma.message.findMany({
          where: {
            receiverID: userID,
            MessageStatus: {
              some: {
                isRead: false,
              },
            },
          },
          distinct: ["senderID"],
        });

        return hello.length;
      },
    });
    t.list.field("getMessages", {
      type: "GroupMessage",
      args: { userID: nonNull(idArg()), search: stringArg() },
      resolve: async (_, { userID, search }): Promise<any> => {
        const messages = await prisma.message.findMany({
          where: {
            OR: [{ senderID: userID }, { receiverID: userID }],
            sender: {
              OR: [
                {
                  Profile: {
                    firstname: {
                      contains: search,
                      mode: "insensitive",
                    },
                    lastname: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
            receiver: {
              OR: [
                {
                  Profile: {
                    firstname: {
                      contains: search,
                      mode: "insensitive",
                    },
                    lastname: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            receiver: true,
            sender: true,
            Media: true,
          },
          distinct: ["receiverID", "senderID"],
        });

        const groupedMessages = groupBy(messages, (message) => {
          return message.senderID === userID
            ? message.receiverID
            : message.senderID;
        });

        return Object.entries(groupedMessages).map(([userID, messages]) => ({
          userID,
          message: messages[0],
        }));
      },
    });
  },
});
