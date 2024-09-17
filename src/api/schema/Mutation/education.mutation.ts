import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const EducationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createEducationBackground", {
      type: "EducationPayload",
      args: { profileID: nonNull(idArg()), input: nonNull("EducationInput") },
      resolve: async (
        _,
        {
          profileID,
          input: {
            school,
            degree,
            study,
            startMonth,
            startYear,
            endMonth,
            endYear,
          },
        }
      ): Promise<any> => {
        const education = await prisma.education.create({
          data: {
            school,
            degree,
            study,
            startMonth,
            startYear,
            endMonth,
            endYear,
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

        await prisma.activityLogs.create({
          data: {
            title: "Created a Education Background",
            description: "You create your education background",
            User: { connect: { userID: user.userID } },
          },
        });

        return {
          __typename: "education",
          ...education,
        };
      },
    });
    t.field("updateEducationBackground", {
      type: "education",
      args: { educationID: nonNull(idArg()), input: "EducationInput" },
      resolve: async (_, { educationID, input }): Promise<any> => {
        const education = await prisma.education.update({
          data: {
            ...input,
          },
          where: {
            educationID,
          },
        });

        const user = await prisma.user.findFirst({
          where: {
            Profile: {
              Education: { some: { educationID } },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated Education",
            description: "You updated your education background",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return education;
      },
    });

    t.field("deleteEducationBackground", {
      type: "education",
      args: { educationID: nonNull(idArg()) },
      resolve: async (_, { educationID }): Promise<any> => {
        const education = await prisma.education.delete({
          where: { educationID },
          select: {
            Profile: true,
            educationID: true
          },
        });

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID: education.Profile.profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted  Education Backgorund",
            description: "You deleted your education background",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });

        return education;
      },
    });
  },
});
