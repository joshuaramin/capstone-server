import { objectType } from "nexus";

export const ApplicationObject = objectType({
  name: "application",
  definition(t) {
    t.id("applicationID");
    t.string("id");
    t.string("status");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
