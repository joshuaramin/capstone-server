import { objectType } from "nexus";

export const AboutObject = objectType({
  name: "about",
  definition(t) {
    t.id("aboutID");
    t.string("bio");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
