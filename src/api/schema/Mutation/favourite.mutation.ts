import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const FavouriteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createFavourite", {
      type: "FavouritePayload",
      args: { userID: nonNull(idArg()), jobPostID: nonNull(idArg()) },
      resolve: async (_, args): Promise<any> => {
        for (const key in args) {
          if (args.hasOwnProperty(key)) {
            if (!args[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key}is required`,
              };
            }
          }
        }

        const user = await prisma.user.findUnique({
          where: { userID: args.userID },
        });

        const jobPost = await prisma.jobPost.findFirst({
          where: {
            jobPostID: args.jobPostID,
          },
        });

        if (user.verified === false) {
          return {
            __typename: "ErrorObject",
            code: 401,
            message: "You don't have an access on this resources",
          };
        }

        await prisma.activityLogs.create({
          data: {
            title: "Added to Save Jobs",
            description: `You added ${jobPost.title} in your save job list`,
            User: { connect: { userID: args.userID } },
          },
        });

        const result = await prisma.favourite.create({
          data: {
            User: {
              connect: { userID: args.userID },
            },
            JobPost: {
              connect: { jobPostID: args.jobPostID },
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
