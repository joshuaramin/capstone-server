import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const AboutQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAboutByProfileID", {
      type: "about",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.about.findFirst({
          where: {
            profileID,
          },
        });
      },
    });
    t.field("getAboutById", {
      type: "about",
      args: { aboutID: nonNull(idArg()) },
      resolve: async (_, { aboutID }): Promise<any> => {
        return await prisma.about.findFirst({
          where: { aboutID },
        });
      },
    });
  },
});
