import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const PortfolioObject = objectType({
  name: "portfolio",
  definition(t) {
    t.id("portfolioID");
    t.string("title");
    t.string("description");
    t.string("employementType");
    t.string("companyName");
    t.string("location");
    t.date("startDate");
    t.date("endDate");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.list.field("media", {
      type: "media",
      resolve: async ({ portfolioID }): Promise<any> => {
        return await prisma.media.findMany({
          where: {
            portfolioID,
          },
        });
      },
    });
  },
});
