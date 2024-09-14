import { objectType } from "nexus";

export const fontObject = objectType({
  name: "fonts",
  definition(t) {
    t.id("fontID");
    t.string("font");
    t.string("image");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
