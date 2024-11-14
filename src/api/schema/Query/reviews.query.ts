import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ReviewQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getAllCompanyReview", {
      type: "ReviewPagination",
      args: { input: nonNull("PaginationInput"), companyID: nonNull(idArg()) },
      resolve: async (
        _,
        { input: { take, page }, companyID }
      ): Promise<any> => {
        const results = await prisma.review.findMany({
          where: {
            Company: {
              companyID,
            },
          },
        });

        const offset = (page - 1) * take;
        const item = results.slice(offset, offset + take);
        return {
          item,
          totalPages: Math.ceil(results.length / take),
          totalItems: results.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(results.length / take),
          hasPrevPage: page > 1,
        };
      },
    });
    t.field("getReviewById", {
      type: "review",
      args: { reviewID: nonNull(idArg()) },
      resolve: async (_, { reviewID }) => {
        return await prisma.review.findFirst({
          where: {
            reviewID,
          },
        });
      },
    });
  },
});
