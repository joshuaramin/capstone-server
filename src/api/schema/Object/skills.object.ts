import { objectType } from "nexus";

export const SkillsObject = objectType({
  name: "skills",
  definition(t) {
    t.id("skillsID");
    t.string("skills");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
