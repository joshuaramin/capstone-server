import { extendType, list, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { id } from "date-fns/locale";
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
            },
          });
        }
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
