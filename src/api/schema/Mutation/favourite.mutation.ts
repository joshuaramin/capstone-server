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

        const jobPost = await prisma.jobPost.findFirst({
          where: {
            jobPostID,
          },
        });

        if (user.verified === false) {
          return ERROR_MESSAGE_FORBIDDEN;
        }

        await prisma.activityLogs.create({
          data: {
            title: "Added to Save Jobs",
            description: `You added ${jobPost.title} in your save job list`,
            User: { connect: { userID } },
          },
        });

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
        const favourite = await prisma.favourite.delete({
          where: { favouriteID },
          select: {
            JobPost: true,
            User: true,
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Job Post Removed",
            description: `You removed the ${favourite.JobPost.title} save job in your list`,
            User: {
              connect: {
                userID: favourite.User.userID,
              },
            },
          },
        });

        return favourite;
      },
    });
  },
});
