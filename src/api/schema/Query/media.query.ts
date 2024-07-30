import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const MediaQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllMediaProfile", {
      type: "media",
      args: {
        profileID: nonNull(idArg()),
        pagination: nonNull("PaginationInput"),
      },
      resolve: async (
        _,
        { profileID, pagination: { page, take } }
      ): Promise<any> => {
        return await prisma.media.findMany({
          where: { profileID },
          take,
          skip: take * (page - 1),
        });
      },
    });
  },
});
