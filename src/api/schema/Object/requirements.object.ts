import { objectType } from "nexus";

export const RequirementsObject = objectType({
  name: "requirement",
  definition(t) {
    t.id("requirementID");
    t.string("requirement");
    t.string("type");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
