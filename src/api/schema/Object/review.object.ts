import { objectType } from "nexus";

export const ReviewObject = objectType({
  name: "review",
  definition(t) {
    t.id("reviewID");
    t.string("review");
    t.int("rating");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
