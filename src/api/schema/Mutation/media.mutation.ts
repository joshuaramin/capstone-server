import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

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
  },
});
