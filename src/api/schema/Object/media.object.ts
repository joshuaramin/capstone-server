import { objectType } from "nexus";

export const MediaObject = objectType({
  name: "media",
  definition(t) {
    t.id("mediaID");
    t.string("media");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
