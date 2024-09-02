import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const FavouriteObject = objectType({
  name: "favourite",
  definition(t) {
    t.id("favouriteID");
    t.datetime("createdAt");
    t.field("user", {
      type: "user",
      resolve: async ({ favouriteID }): Promise<any> => {
        return await prisma.user.findMany({
          where: {
            Favourite: {
              some: {
                favouriteID,
              },
            },
          },
        });
      },
    });
    t.field("jobPost", {
      type: "jobpost",
      resolve: async ({ favouriteID }) => {
        return await prisma.jobPost.findFirst({
          where: {
            Favourite: {
              some: {
                favouriteID,
              },
            },
          },
        });
      },
    });
  },
});
