import { objectType, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { startOfWeek, startOfMonth } from "date-fns";

export const DashboardObject = objectType({
  name: "DashboardObject",
  definition(t) {
    t.id("userID");
    t.int("users");
    t.int("jobpost");
    t.int("applicants");
    t.int("report");
    t.int("company");
    t.int("freelancers");
    t.int("schedule");
    t.list.field("jobpostList", {
      type: "JobCount",
      args: { filter: stringArg() },
      resolve: async (_, { filter }): Promise<any> => {
        const today = new Date();

        let startDate;

        if (filter === "week") {
          startDate = startOfWeek(today, { weekStartsOn: 1 });
        } else if (filter === "month") {
          startDate = startOfMonth(today);
        } else {
          throw new Error("Invalid period specified. Use 'week' or 'month'.");
        }

        const jobpost = await prisma.application.groupBy({
          by: ["jobPostID"],
          orderBy: {
            _count: {
              applicationID: "asc",
            },
          },
          where: {
            jobPostID: {
              not: null,
            },
            createdAt: {
              gte: startDate,
              lte: today,
            },
          },
          _count: {
            applicationID: true,
          },
          take: 10,
        });
        return jobpost.map(({ _count, jobPostID }) => {
          return {
            applicants: _count.applicationID,
            jobPostID: jobPostID,
          };
        });
      },
    });
  },
});

export const EmployerDashboardObect = objectType({
  name: "EmployerDashboard",
  definition(t) {
    t.id("companyID");
    t.id("userID");
    t.int("JobPost");
    t.int("schedule");
    t.int("projects");
    t.int("applicants");
    t.list.field("getScheduleList", {
      type: "schedule",
      resolve: async ({ userID }) => {
        return await prisma.schedule.findMany({
          where: {
            senderID: userID,
          },
        });
      },
    });
    t.list.field("getMyJobPost", {
      type: "JobCount",
      args: { filter: stringArg() },
      resolve: async ({ companyID }, { filter }): Promise<any> => {
        const today = new Date();

        let startDate;

        if (filter === "week") {
          startDate = startOfWeek(today, { weekStartsOn: 1 });
        } else if (filter === "month") {
          startDate = startOfMonth(today);
        }

        const jobpost = await prisma.application.groupBy({
          by: ["jobPostID"],
          orderBy: {
            _count: {
              applicationID: "asc",
            },
          },

          where: {
            JobPost: {
              companyID,
            },
          },
          _count: {
            applicationID: true,
          },
        });

        return jobpost.map(({ _count, jobPostID }) => {
          return {
            applicants: _count.applicationID,
            jobPostID,
          };
        });
      },
    });
  },
});
