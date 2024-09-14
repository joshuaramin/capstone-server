import { extendType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const FontQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAllFonts", {
      type: "FontPagination",
      args: { search: stringArg(), pagination: nonNull("PaginationInput") },
      resolve: async (
        _,
        { search, pagination: { page, take } }
      ): Promise<any> => {
        const getAllFonts = await prisma.font.findMany({
          where: {
            font: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = getAllFonts.slice(offset, offset + take);

        return {
          item,
          totalPages: Math.ceil(getAllFonts.length / take),
          totalItems: getAllFonts.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getAllFonts.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
  },
});
