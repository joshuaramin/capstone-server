import { extendType, idArg, inputObjectType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const AboutInput = inputObjectType({
  name: "AboutInput",
  definition(t) {
    t.string("bio");
  },
});

export const AboutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createAbout", {
      type: "AboutPayload",
      args: { profileID: nonNull(idArg()), input: nonNull("AboutInput") },
      resolve: async (_, { input: { bio }, profileID }): Promise<any> => {
        if (!bio) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Bio is required",
          };
        }
        const about = await prisma.about.create({
          data: {
            bio,
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        if (!user) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "You Profile Not Found",
          };
        }

        await prisma.activityLogs.create({
          data: {
            title: "Created About",
            description: "You created your about",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });
        return {
          __typename: "about",
          ...about,
        };
      },
    });

    t.field("updateAbout", {
      type: "about",
      args: { aboutID: nonNull(idArg()), bio: nonNull(stringArg()) },
      resolve: async (_, { aboutID, bio }): Promise<any> => {
        const about = await prisma.about.update({
          data: { bio },
          where: { aboutID },
          select: {
            aboutID: true,
            Profile: true,
          },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID: about.Profile.profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated About",
            description: "You updated your about",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });

        return about;
      },
    });
    t.field("deleteAbout", {
      type: "about",
      args: { aboutID: nonNull(idArg()) },
      resolve: async (_, { aboutID }) => {
        const about = await prisma.about.delete({
          where: { aboutID },
          select: {
            aboutID: true,
            Profile: true,
          },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID: about.Profile.profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted About",
            description: "You deleted you about",
            User: { connect: { userID: user.userID } },
          },
        });

        return about;
      },
    });
  },
});
