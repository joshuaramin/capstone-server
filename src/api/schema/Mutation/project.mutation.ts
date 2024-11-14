import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { format } from "date-fns";

export const ProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateProjectDetails", {
      type: "project",
      args: {
        projectOrganizerID: nonNull(idArg()),
        title: nonNull(stringArg()),
        amount: nonNull(intArg()),
        startDate: nonNull("Date"),
        endDate: nonNull("Date"),
        userID: nonNull(idArg()),
      },
      resolve: async (_, args): Promise<any> => {
        for (const key in args) {
          if (args.hasOwnProperty(key)) {
            if (!args[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key}is required`,
              };
            }
          }
        }

        const project = await prisma.projectOrganizer.update({
          data: {
            title: args.title,
            amount: args.amount,
            startDate: args.startDate,
            endDate: args.endDate,
          },
          where: { projectOrganizerID: args.projectOrganizerID },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated Project Details",
            description: "You Updated the Project Details",
            User: {
              connect: {
                userID: args.userID,
              },
            },
          },
        });

        return project;
      },
    });

    t.field("updateProjectStatus", {
      type: "project",
      args: {
        projectOrganizerID: nonNull(idArg()),
        userID: nonNull(idArg()),
        status: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { projectOrganizerID, status, userID }
      ): Promise<any> => {
        const project = await prisma.projectOrganizer.update({
          data: {
            status,
          },
          where: {
            projectOrganizerID,
          },
          include: {
            User: true,
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated Project Status",
            description: "You Updated a Project Status",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return project;
      },
    });
    t.list.field("generateProjectOrganizer", {
      type: "project",
      args: {
        startDate: stringArg(),
        endDate: stringArg(),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { userID, endDate, startDate }): Promise<any> => {
        return await prisma.projectOrganizer.findMany({
          where: {
            userID,
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        });
      },
    });
  },
});
