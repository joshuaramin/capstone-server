import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ZoomQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getMyZoomIntegration", {
      type: "zintegration",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }) => {
        return await prisma.zintegration.findFirst({
          where: { userID },
        });
      },
    });
  },
});
