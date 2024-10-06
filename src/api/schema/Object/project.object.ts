import { objectType } from "nexus";

export const Project = objectType({
  name: "project",
  definition(t) {
    t.id("projectOrganizerID");
    t.string("status");
    t.float("amount");
    t.datetime("startDate");
    t.datetime("endDate");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
