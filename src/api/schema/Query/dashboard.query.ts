import { extendType, idArg } from "nexus";
import { prisma } from "../../helpers/server";

export const DashboardQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getDashboardQuery", {
      type: "DashboardObject",
      resolve: async () => {
        const user = await prisma.user.count({
          where: {
            isArchive: false,
          },
        });
        const jobpost = await prisma.jobPost.count();
        const applicants = await prisma.application.count();
        const companies = await prisma.company.count();
        const freelancers = await prisma.user.count({
          where: {
            role: "freelance",
          },
        });

        const report = await prisma.report.count();
        const schedule = await prisma.schedule.count();

        return {
          users: user,
          jobpost,
          applicants,
          schedule,
          report,
          company: companies,
          freelancers,
        };
      },
    });
    t.field("getEmployerDashboardQuery", {
      type: "EmployerDashboard",
      args: { companyID: idArg() },
      resolve: async (_, { companyID }) => {
        const company = await prisma.company.findFirst({
          where: {
            companyID,
          },
          include: {
            User: {
              include: { Profile: true },
            },
          },
        });

        const applicants = await prisma.application.count({
          where: {
            JobPost: {
              companyID,
            },
          },
        });

        const schedule = await prisma.schedule.count({
          where: {
            senderID: company.userID,
          },
        });

        const projects = await prisma.projectOrganizer.count({
          where: { companyID },
        });
        const jobpost = await prisma.jobPost.count({
          where: {
            companyID,
          },
        });

        return {
          JobPost: jobpost,
          projects,
          schedule,
          applicants,
          userID: company.userID,
          companyID,
        };
      },
    });
  },
});
