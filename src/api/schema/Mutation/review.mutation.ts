import { extendType, floatArg, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const ReviewMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserReview", {
      type: "review",
      args: {
        rating: nonNull(floatArg()),
        review: nonNull(stringArg()),
        userID: nonNull(idArg()),
      },
      resolve: async (_, { rating, review, userID }): Promise<any> => {
        if (!rating || !review) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        return await prisma.review.create({
          data: {
            rating,
            review,
            User: {
              connect: { userID },
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
      resolve: async (_, { rating, review, companyID }): Promise<any> => {
        return await prisma.review.create({
          data: {
            rating,
            review,
            Company: {
              connect: {
                companyID,
              },
            },
          },
        });
      },
    });
  },
});
