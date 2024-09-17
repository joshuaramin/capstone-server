import {
  extendType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  stringArg,
} from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const ProfileInput = inputObjectType({
  name: "ProfileInput",
  definition(t) {
    t.string("firstname");
    t.string("lastname");
    t.string("phone");
    t.date("birthday");
  },
});

export const ProfileMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateProfile", {
      type: "profile",
      args: { profileID: nonNull(idArg()), input: nonNull("ProfileInput") },
      resolve: async (
        _,
        { profileID, input: { firstname, lastname, birthday, phone } }
      ): Promise<any> => {
        return await prisma.profile.update({
          where: { profileID },
          data: { firstname, lastname, birthday, phone },
        });
      },
    });
    t.field("addProfileThemnFonts", {
      type: "profile",
      args: {
        profileID: nonNull(idArg()),
        fontID: nonNull(idArg()),
        themeID: nonNull(idArg()),
      },
      resolve: async (_, { profileID, fontID, themeID }): Promise<any> => {
        return await prisma.profile.update({
          data: {
            Font: {
              connect: { fontID },
            },
            theme: {
              connect: { themeID },
            },
          },
          where: {
            profileID,
          },
        });
      },
    });
    t.field("addProfileAvatar", {
      type: "profile",
      args: { profileID: nonNull(idArg()), file: nonNull("Upload") },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;

        const prof = await prisma.profile.update({
          data: {
            Avatar: {
              create: {
                media: await uploader(createReadStream()),
              },
            },
          },
          where: { profileID },
        });

        const user = await prisma.user.findFirst({
          where: {
            Profile: { profileID },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Created Profile Avatar",
            description: "You created a profile avatar",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return prof;
      },
    });
    t.field("deleteProfileAvatar", {
      type: "profile",
      args: { profileID: nonNull(idArg()), mediaID: nonNull(idArg()) },
      resolve: async (_, { profileID, mediaID }): Promise<any> => {
        const media = await prisma.media.delete({
          where: { mediaID },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted Profile avatar",
            description: "You deleted your Profile avatar",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return media;
      },
    });
    t.field("addProfileHeader", {
      type: "profile",
      args: { profileID: nonNull(idArg()), file: nonNull("Upload") },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;

        const prof = await prisma.profile.update({
          data: {
            Header: {
              create: {
                media: await uploader(createReadStream()),
              },
            },
          },
          where: { profileID },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Added Header Profile",
            description: "You added your Header Profile",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });

        return prof;
      },
    });
    t.field("addSkillToProfile", {
      type: "profile",
      args: { profileID: nonNull(idArg()), skills: list(stringArg()) },
      resolve: async (_, { profileID, skills }): Promise<any> => {
        const skill = await prisma.profile.update({
          data: {
            Skills: {
              connect: skills.map((skilled) => {
                return {
                  skills: skilled,
                };
              }),
            },
          },
          where: { profileID },
        });

        const user = await prisma.user.findFirst({
          where: {
            Profile: { profileID },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Added Skill to Profile",
            description: "You added skills to your profile",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return skill;
      },
    });
    t.field("removedSkillToProfile", {
      type: "profile",
      args: { profileID: nonNull(idArg()), skillsID: nonNull(idArg()) },
      resolve: async (_, { profileID, skillsID }): Promise<any> => {
        const skill = await prisma.profile.update({
          data: {
            Skills: {
              disconnect: {
                skillsID,
              },
            },
          },
          where: { profileID },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Removed Skill to Profile",
            description: "You removed your skills to your profile",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });

        return skill;
      },
    });
    t.field("deleteProfileHeader", {
      type: "profile",
      args: { profileID: nonNull(idArg()), mediaID: nonNull(idArg()) },
      resolve: async (_, { profileID, mediaID }): Promise<any> => {
        const media = await prisma.media.delete({
          where: { mediaID },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted Header Profile",
            description: "You deleted your header profile",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return media;
      },
    });
  },
});
