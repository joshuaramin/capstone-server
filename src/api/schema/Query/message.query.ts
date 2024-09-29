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
      type: "user",
      args: { search: stringArg(), senderID: nonNull(stringArg()) },
      resolve: async (_, { senderID, search }): Promise<any> => {
        const message = await prisma.message.findMany({
          where: {
            OR: [
              {
                sender: {
                  userID: senderID,
                },
              },
              {
                receiver: {
                  userID: senderID,
                },
              },
            ],
          },
          select: {
            senderID: true,
            receiver: true,
          },
          distinct: "senderID",
        });

        const sendersIDs = message.map((message) => message.senderID);

        let whereArr: any = {
          userID: {
            in: sendersIDs,
          },
        };
        if (search) {
          whereArr.Profile = {
            OR: [
              {
                firstname: search,
              },
              {
                lastname: search,
              },
            ],
          };
        }

        let queryParams = {
          where: whereArr,
        };

        return await prisma.user.findMany(queryParams);
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
