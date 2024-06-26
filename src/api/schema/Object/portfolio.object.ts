import { objectType } from "nexus";

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
  },
});
