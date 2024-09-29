import { objectType } from "nexus";

export const SocialObject = objectType({
  name: "social",
  definition(t) {
    t.id("socialID");
    t.string("instagram");
    t.string("facebook");
    t.string("Github");
    t.string("X");
    t.string("Web");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
