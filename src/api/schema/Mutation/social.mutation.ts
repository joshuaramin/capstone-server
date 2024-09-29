import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const SocialMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSocialLink", {
      type: "social",
      args: {
        instagram: stringArg(),
        facebook: stringArg(),
        Github: stringArg(),
        X: stringArg(),
        Web: stringArg(),
        profileID: nonNull(idArg()),
      },
      resolve: async (
        _,
        { instagram, Github, Web, X, facebook, profileID }
      ) => {
        return await prisma.social.create({
          data: {
            instagram,
            facebook,
            Github,
            X,
            Web,
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });
      },
    });

    t.field("updateSocialLink", {
      type: "social",
      args: {
        socialID: nonNull(idArg()),
        facebook: stringArg(),
        Github: stringArg(),
        instagram: stringArg(),
        Web: stringArg(),
        X: stringArg(),
      },
      resolve: async (
        _,
        { facebook, Github, socialID, Web, instagram, X }
      ): Promise<any> => {
        return await prisma.social.update({
          data: {
            facebook,
            Github,
            instagram,
            Web,
            X,
          },
          where: {
            socialID,
          },
        });
      },
    });
  },
});
