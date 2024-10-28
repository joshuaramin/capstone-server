import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const ReportObject = objectType({
  name: "report",
  definition(t) {
    t.id("reportID");
    t.string("message");
    t.list.field("jobPost", {
      type: "jobpost",
      resolve: async ({ reportID }) => {
        return await prisma.jobPost.findMany({
          where: {
            Report: {
              some: {
                reportID,
              },
            },
          },
        });
      },
    });
    t.field("user", {
      type: "user",
      resolve: async ({ reportID }) => {
        return await prisma.user.findFirst({
          where: {
            report: {
              some: { reportID },
            },
          },
        });
      },
    });
    t.datetime("createdAt");
  },
});
