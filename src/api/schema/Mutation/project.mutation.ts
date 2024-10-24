import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

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
      resolve: async (
        _,
        { title, amount, startDate, endDate, projectOrganizerID, userID }
      ): Promise<any> => {
        if (!title || !amount || !startDate || !endDate) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const project = await prisma.projectOrganizer.update({
          data: {
            title,
            amount,
            startDate,
            endDate,
          },
          where: { projectOrganizerID },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated Project Details",
            description: "You Updated the Project Details",
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
  },
});
