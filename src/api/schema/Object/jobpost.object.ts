import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const JobPost = objectType({
  name: "jobpost",
  definition(t) {
    t.id("jobPostID");
    t.string("title");
    t.string("description");
    t.string("location");
    t.string("experience");
    t.string("slug");
    t.string("duration");
    t.date("endDate");
    t.string("status");
    t.boolean("isArchive");
    t.string("isOpen");
    t.list.string("JobType");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("salary", {
      type: "salary",
      resolve: async ({ jobPostID }): Promise<any> => {
        return await prisma.salary.findFirst({
          where: { jobPostID },
        });
      },
    });
    t.list.field("skills", {
      type: "skills",
      resolve: async ({ jobPostID }): Promise<any> => {
        return await prisma.skills.findMany({
          where: {
            JobPost: {
              some: {
                jobPostID,
              },
            },
          },
        });
      },
    });
    t.list.field("applicants", {
      type: "application",
      resolve: async ({ jobPostID }) => {
        return await prisma.application.findMany({
          where: { jobPostID },
        });
      },
    });
    t.int("totalApplicant", {
      resolve: async ({ jobPostID }): Promise<any> => {
        return await prisma.application.count({
          where: { jobPostID },
        });
      },
    });
    t.field("getCompany", {
      type: "company",
      resolve: async ({ jobPostID }): Promise<any> => {
        return await prisma.company.findFirst({
          where: {
            JobPost: {
              some: {
                jobPostID,
              },
            },
          },
        });
      },
    });
  },
});

export const JobPostCount = objectType({
  name: "JobCount",
  definition(t) {
    t.string("jobPostID");
    t.int("applicants");
    t.field("jobTitle", {
      type: "jobpost",
      resolve: async ({ jobPostID }) => {
        return await prisma.jobPost.findFirst({
          where: {
            jobPostID,
          },
        });
      },
    });
  },
});
