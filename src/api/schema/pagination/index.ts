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

export const UserPagination = objectType({
  name: "UserPagination",
  definition(t) {
    t.list.field("item", {
      type: "user",
    });
    t.int("totalPages");
    t.int("currentPage");
    t.int("totalItems");
    t.boolean("hasNextPage");
    t.boolean("hasPrevPage");
  },
});
