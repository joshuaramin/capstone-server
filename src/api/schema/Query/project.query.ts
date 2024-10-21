import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ProjectOrganizerQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserProjectOrganizer", {
      type: "ProjectOrganizerPagination",
      args: {
        userID: nonNull(idArg()),
        input: nonNull("PaginationInput"),
        status: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { userID, input: { page, take }, status }
      ): Promise<any> => {
        const project = await prisma.projectOrganizer.findMany({
          where: {
            userID,
            status,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = project.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(project.length / take),
          totalItems: project.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(project.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
    t.field("getCompanyProjects", {
      type: "ProjectOrganizerPagination",
      args: {
        companyID: nonNull(idArg()),
        input: nonNull("PaginationInput"),
        search: nonNull(stringArg()),
        orderBy: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { companyID, input: { page, take }, search, orderBy }
      ): Promise<any> => {
        const project = await prisma.projectOrganizer.findMany({
          where: {
            companyID,
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: orderBy as any,
          },
        });

        const offset = (page - 1) * take;
        const item = project.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(project.length / take),
          totalItems: project.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(project.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
    t.field("getProjectOrganizedID", {
      type: "project",
      args: { projectOrganizerID: nonNull(idArg()) },
      resolve: async (_, { projectOrganizerID }) => {
        return await prisma.projectOrganizer.findFirst({
          where: {
            projectOrganizerID,
          },
        });
      },
    });
  },
});
