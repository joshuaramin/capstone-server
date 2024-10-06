import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ProjectOrganizerQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getUserProjectOrganizer", {
      type: "ProjectOrganizerPagination",
      args: { userID: nonNull(idArg()), input: nonNull("PaginationInput") },
      resolve: async (_, { userID, input: { page, take } }): Promise<any> => {
        const project = await prisma.projectOrganizer.findMany({
          where: {
            userID,
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
    t.list.field("getCompanyProjects", {
      type: "ProjectOrganizerPagination",
      args: { companyID: nonNull(idArg()), input: nonNull("PaginationInput") },
      resolve: async (
        _,
        { companyID, input: { page, take } }
      ): Promise<any> => {
        const project = await prisma.projectOrganizer.findMany({
          where: {
            companyID,
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
  },
});
