import { extendType, floatArg, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ReviewMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserReview", {
      type: "review",
      args: {
        rating: nonNull(floatArg()),
        review: nonNull(stringArg()),
        userID: nonNull(idArg()),
        companyID: nonNull(idArg()),
      },
      resolve: async (_, args): Promise<any> => {
        for (const key in args) {
          if (args.hasOwnProperty(key)) {
            if (!args[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key} is required`,
              };
            }
          }
        }
        return await prisma.review.create({
          data: {
            rating: args.rating,
            review: args.review,
            User: {
              connect: { userID: args.userID },
            },
          },
        });
      },
    });
    t.field("createCompanyReview", {
      type: "review",
      args: {
        rating: nonNull(floatArg()),
        review: nonNull(stringArg()),
        companyID: nonNull(idArg()),
      },
      resolve: async (_, args): Promise<any> => {
        for (const key in args) {
          if (args.hasOwnProperty(key)) {
            if (!args[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key} is required`,
              };
            }
          }
        }

        return await prisma.review.create({
          data: {
            rating: args.rating,
            review: args.review,
            Company: {
              connect: {
                companyID: args.companyID,
              },
            },
          },
        });
      },
    });
  },
});
