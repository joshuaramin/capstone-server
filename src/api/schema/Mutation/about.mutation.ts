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
      type: "about",
      args: { profileID: nonNull(idArg()), input: nonNull("AboutInput") },
      resolve: async (_, { input: { bio }, profileID }): Promise<any> => {
        return await prisma.about.create({
          data: {
            bio,
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });
      },
    });

    t.field("updateAbout", {
      type: "about",
      args: { aboutID: nonNull(idArg()), bio: nonNull(stringArg()) },
      resolve: async (_, { aboutID, bio }): Promise<any> => {
        return await prisma.about.update({
          data: { bio },
          where: { aboutID },
        });
      },
    });
  },
});
