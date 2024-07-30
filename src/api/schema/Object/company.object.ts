import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const CompanyObject = objectType({
  name: "company",
  definition(t) {
    t.id("companyID");
    t.string("companyName");
    t.string("description");
    t.string("location");
    t.boolean("verified");
    t.string("companySize");
    t.field("logo", {
      type: "media",
      resolve: async (): Promise<any> => {
        return await prisma.media.findFirst({
          where: {},
        });
      },
    });
    t.list.field("jobPost", {
      type: "jobpost",
      resolve: async ({ companyID }): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: { companyID },
        });
      },
    });
    t.int("getJobPostCount", {
      resolve: async ({ companyID }): Promise<any> => {
        return await prisma.jobPost.count({
          where: {
            companyID,
          },
        });
      },
    });
  },
});
