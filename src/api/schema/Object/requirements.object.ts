import { objectType } from "nexus";

export const RequirementsObject = objectType({
  name: "requirement",
  definition(t) {
    t.id("requirementsID");
    t.string("requirement");
    t.string("type");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
