import { objectType } from "nexus";

export const JobPagingation = objectType({
  name: "JobPagination",
  definition(t) {
    t.list.field("item", {
      type: "jobpost",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});
