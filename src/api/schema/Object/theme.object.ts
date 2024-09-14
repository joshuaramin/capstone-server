import { objectType } from "nexus";

export const themeObject = objectType({
  name: "theme",
  definition(t) {
    t.id("themeID");
    t.string("theme");
    t.string("image");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
