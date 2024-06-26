import { objectType } from "nexus";

export const JobPost = objectType({
  name: "jobpost",
  definition(t) {
    t.id("jobPostID");
    t.string("title");
    t.string("description");
    t.list.string("keyword");
    t.boolean("default");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
