import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const MediaMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteMedia", {
      type: "media",
      args: { mediaID: nonNull(idArg()) },
      resolve: async (_, { mediaID }): Promise<any> => {
        return await prisma.media.delete({
          where: { mediaID },
        });
      },
    });
    t.field("createAvatar", {
      type: "MediaPayload",
      args: { profileID: nonNull(idArg()), file: nonNull("Upload") },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;

        if (!file) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const media = await prisma.media.create({
          data: {
            media: await uploader(createReadStream()),
            Profile: {
              connect: { profileID },
            },
          },
        });

        return {
          __typename: "media",
          ...media,
        };
      },
    });
  },
});
