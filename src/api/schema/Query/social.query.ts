import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const SociaQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAllMySocialLink", {
      type: "social",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.social.findFirst({
          where: {
            profileID,
          },
        });
      },
    });
  },
});
