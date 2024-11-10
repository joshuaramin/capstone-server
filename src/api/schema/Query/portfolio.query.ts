import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const PortfolioQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getPortfolioByProfileID", {
      type: "portfolio",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.portfolio.findMany({
          where: {
            profileID,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      },
    });
  },
});
