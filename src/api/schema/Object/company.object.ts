import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const CompanyObject = objectType({
  name: "company",
  definition(t) {
    t.id("companyID");
    t.string("companyName");
    t.string("description");
    t.string("slug");
    t.string("location");
    t.boolean("verified");
    t.string("companySize");
    t.list.field("requirements", {
      type: "requirement",
      resolve: async ({ companyID }) => {
        return await prisma.requirements.findMany({
          where: {
            companyID,
          },
        });
      },
    });
    t.field("logo", {
      type: "media",
      resolve: async ({ companyID }): Promise<any> => {
        return await prisma.media.findFirst({
          where: { companyID },
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
    t.field("user", {
      type: "user",
      resolve: async ({ companyID }) => {
        return await prisma.user.findFirst({
          where: {
            Company: {
              companyID,
            },
          },
        });
      },
    });
    t.list.field("companyProject", {
      type: "project",
      resolve: async ({ companyID }) => {
        return await prisma.projectOrganizer.findMany({
          where: {
            companyID,
          },
        });
      },
    });
  },
});
