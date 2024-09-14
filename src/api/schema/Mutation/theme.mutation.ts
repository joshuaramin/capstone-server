import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const ThemeMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTheme", {
      type: "theme",
      args: {
        userID: nonNull(idArg()),
        theme: nonNull(stringArg()),
        file: nonNull("Upload"),
      },
      resolve: async (_, { userID, theme, file }) => {
        const { createReadStream, filename } = await file;

        const themes = await prisma.theme.create({
          data: {
            theme,
            image: await uploader(createReadStream()),
            User: {
              connect: { userID },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Created a Theme",
            description: "You created a profile theme",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return themes;
      },
    });
    t.field("updateTheme", {
      type: "theme",
      args: {
        themeID: nonNull(idArg()),
        file: "Upload",
        theme: nonNull(stringArg()),
      },
      resolve: async (_, { themeID, file, theme }): Promise<any> => {
        if (file) {
          const { createReadStream, filename } = await file;
          const themes = await prisma.theme.update({
            data: {
              image: await uploader(createReadStream()),
              theme,
            },
            where: { themeID },
            select: {
              themeID: true,
              User: true,
            },
          });

          await prisma.activityLogs.create({
            data: {
              title: "Updated a Theme",
              description: "You updated a profile theme",
              User: {
                connect: { userID: themes.User.userID },
              },
            },
          });

          return themes;
        } else {
          const themes = await prisma.theme.update({
            data: {
              theme,
            },
            where: { themeID },
            select: {
              themeID: true,
              User: true,
            },
          });

          await prisma.activityLogs.create({
            data: {
              title: "Updated a Theme",
              description: "You updated a profile theme",
              User: {
                connect: { userID: themes.User.userID },
              },
            },
          });

          return themes;
        }
      },
    });
    t.field("deleteTheme", {
      type: "theme",
      args: { themeID: nonNull(idArg()) },
      resolve: async (_, { themeID }): Promise<any> => {
        const theme = await prisma.theme.delete({
          where: { themeID },
          select: {
            themeID: true,
            User: true,
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted Profile theme",
            description: "You deleted a profile theme",
            User: {
              connect: {
                userID: theme.User.userID,
              },
            },
          },
        });

        return theme;
      },
    });
  },
});
