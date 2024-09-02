import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import {
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_FORBIDDEN,
} from "../../helpers/error";

export const FavouriteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createFavourite", {
      type: "FavouritePayload",
      args: { userID: nonNull(idArg()), jobPostID: nonNull(idArg()) },
      resolve: async (_, { userID, jobPostID }): Promise<any> => {
        if (!userID || !jobPostID) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const user = await prisma.user.findUnique({
          where: { userID },
        });

        if (user.verified === false) {
          return ERROR_MESSAGE_FORBIDDEN;
        }

        const result = await prisma.favourite.create({
          data: {
            User: {
              connect: { userID },
            },
            JobPost: {
              connect: { jobPostID },
            },
          },
        });

        return {
          __typename: "favourite",
          ...result,
        };
      },
    });
    t.field("deleteFavourite", {
      type: "favourite",
      args: { favouriteID: nonNull(idArg()) },
      resolve: async (_, { favouriteID }): Promise<any> => {
        return await prisma.favourite.delete({
          where: { favouriteID },
        });
      },
    });
  },
});
