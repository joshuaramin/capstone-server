import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const MessageObject = objectType({
  name: "message",
  definition(t) {
    t.id("messageID");
    t.string("message");
    t.string("senderID");
    t.string("receiverID");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("messageStatus", {
      type: "MessageStatus",
      resolve: async ({ messageID }) => {
        return await prisma.messageStatus.findFirst({
          where: {
            messageID,
          },
        });
      },
    });
    t.field("media", {
      type: "media",
      resolve: async ({ messageID }): Promise<any> => {
        return await prisma.media.findFirst({
          where: {
            Message: {
              some: { messageID },
            },
          },
        });
      },
    });
    t.field("sendUser", {
      type: "user",
      resolve: async ({ messageID }): Promise<any> => {
        return await prisma.user.findFirst({
          where: {
            sentMessages: {
              some: { messageID },
            },
          },
        });
      },
    });
    t.field("receivedUser", {
      type: "user",
      resolve: async ({ messageID }): Promise<any> => {
        return await prisma.user.findFirst({
          where: {
            receivedMessages: {
              some: {
                messageID,
              },
            },
          },
        });
      },
    });
  },
});
