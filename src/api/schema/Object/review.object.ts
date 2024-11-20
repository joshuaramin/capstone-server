import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const ReviewObject = objectType({
  name: "review",
  definition(t) {
    t.id("reviewID");
    t.string("review");
    t.int("rating");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("company", {
      type: "company",
      resolve: async ({ reviewID }) => {
        return await prisma.company.findFirst({
          where: {
            review: {
              some: {
                reviewID,
              },
            },
          },
        });
      },
    });
    t.field("User", {
      type: "user",
      resolve: async ({ reviewID }) => {
        return await prisma.review.findFirst({
          where: {
            reviewID,
          },
        });
      },
    });
  },
});
