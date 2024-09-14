import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const PortfolioObject = objectType({
  name: "portfolio",
  definition(t) {
    t.id("portfolioID");
    t.string("title");
    t.string("description");
    t.string("locationType");
    t.string("employmentType");
    t.string("companyName");
    t.string("location");
    t.string("startMonth");
    t.string("startYear");
    t.string("endMonth");
    t.string("endYear");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.list.field("skills", {
      type: "skills",
      resolve: async ({ portfolioID }): Promise<any> => {
        return await prisma.skills.findMany({
          where: {
            Portfolio: {
              some: { portfolioID },
            },
          },
        });
      },
    });
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
