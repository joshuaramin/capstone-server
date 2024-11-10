import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const FontsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createFontFamily", {
      type: "fonts",
      args: {
        userID: nonNull(idArg()),
        font: nonNull(stringArg()),
        file: nonNull("Upload"),
      },
      resolve: async (_, { userID, font, file }): Promise<any> => {
        const { createReadStream, filename } = await file;
        const fonts = await prisma.font.create({
          data: {
            font,
            image: await uploader(createReadStream()),
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Created a Profile Font",
            description: "You created a profile font",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return fonts;
      },
    });
    t.field("updateFontFamily", {
      type: "fonts",
      args: {
        fontID: nonNull(stringArg()),
        font: nonNull(stringArg()),
        file: "Upload",
      },
      resolve: async (_, { fontID, file, font }): Promise<any> => {
        if (file) {
          const { createReadStream, filename } = await file;

          const fonts = await prisma.font.update({
            data: {
              image: await uploader(createReadStream()),
            },
            where: {
              fontID,
            },
            select: {
              fontID: true,
              User: true,
            },
          });

          await prisma.activityLogs.create({
            data: {
              title: "Updated Profile Font Family",
              description: "You updated a Profile Font Family",
              User: {
                connect: { userID: fonts.User.userID },
              },
            },
          });

          return fonts;
        } else {
          const fonts = await prisma.font.update({
            data: {
              font,
            },
            where: { fontID },
            select: {
              fontID: true,
              User: true,
            },
          });

          await prisma.activityLogs.create({
            data: {
              title: "Updated Profile Font Family",
              description: "You updated a Profile Font Family",
              User: {
                connect: { userID: fonts.User.userID },
              },
            },
          });

          return fonts;
        }
      },
    });

    t.field("deleteFontFamily", {
      type: "fonts",
      args: { fontID: nonNull(idArg()), userID: nonNull(idArg()) },
      resolve: async (_, { fontID, userID }): Promise<any> => {
        const fonts = await prisma.font.delete({
          where: { fontID },
          select: {
            fontID: true,
            User: true,
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted Font Family",
            description: "You deleted a Font Family",
            User: {
              connect: { userID },
            },
          },
        });
        return fonts;
      },
    });
  },
});
