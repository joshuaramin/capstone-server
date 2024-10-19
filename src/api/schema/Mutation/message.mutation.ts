import { extendType, idArg, list, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const MessageMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createMessage", {
      type: "message",
      args: {
        message: stringArg(),
        senderID: nonNull(stringArg()),
        receiverID: nonNull(stringArg()),
        file: list("Upload"),
      },
      resolve: async (
        _,
        { message, receiverID, senderID, file }
      ): Promise<any> => {
        if (file) {
          file.map(async (upload) => {
            const { createReadStream, filename } = await upload;

            return await prisma.message.create({
              data: {
                Media: {
                  create: {
                    media: await uploader(createReadStream()),
                  },
                },
                MessageStatus: {
                  create: {
                    isRead: false,
                    User: {
                      connect: {
                        userID: receiverID,
                      },
                    },
                  },
                },
                senderID,
                receiverID,
              },
            });
          });
        } else {
          return await prisma.message.create({
            data: {
              message,
              senderID,
              receiverID,
              MessageStatus: {
                create: {
                  isRead: false,
                  User: {
                    connect: {
                      userID: receiverID,
                    },
                  },
                },
              },
            },
          });
        }
      },
    });
    t.field("deleteMessage", {
      type: "message",
      args: { messageID: nonNull(idArg()) },
      resolve: async (_, { messageID }) => {
        return await prisma.message.delete({
          where: { messageID },
        });
      },
    });
    t.field("updateMessageStatus", {
      type: "message",
      args: {
        messageStatusID: nonNull(idArg()),
        receiverID: nonNull(idArg()),
      },
      resolve: async (_, { messageStatusID, receiverID }): Promise<any> => {
        const messageStatus = await prisma.messageStatus.findUnique({
          where: { messageStatusID },
          include: { Message: true },
        });

        if (messageStatus.Message.receiverID !== receiverID) {
          return false;
        }

        return await prisma.messageStatus.update({
          where: {
            messageStatusID,
          },
          data: {
            isRead: true,
          },
        });
      },
    });
  },
});
