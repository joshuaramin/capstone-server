import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const FavouriteQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllMySaveJobs", {
      type: "favourite",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.favourite.findMany({
          where: {
            User: {
              userID,
            },
            JobPost: {
              isNot: null,
            },
          },
        });
      },
    });
    t.field("getMyFavouriteJobPost", {
      type: "favourite",
      args: { userID: nonNull(idArg()), jobPostID: nonNull(idArg()) },
      resolve: async (_, { userID, jobPostID }): Promise<any> => {
        return await prisma.favourite.findFirst({
          where: {
            userID,
            JobPost: {
              jobPostID,
            },
          },
        });
      },
    });
  },
});
