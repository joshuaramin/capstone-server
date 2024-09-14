import { extendType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ThemeQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getThemes", {
      type: "ThemePagination",
      args: { search: stringArg(), pagination: nonNull("PaginationInput") },
      resolve: async (
        _,
        { search, pagination: { page, take } }
      ): Promise<any> => {
        const getAllThemes = await prisma.theme.findMany({
          where: {
            theme: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = getAllThemes.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(getAllThemes.length / take),
          totalItems: getAllThemes.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getAllThemes.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
  },
});
