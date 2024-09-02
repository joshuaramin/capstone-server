import { objectType } from "nexus";

export const ResumeObject = objectType({
  name: "resume",
  definition(t) {
    t.id("resumeID");
    t.string("title");
    t.string("resume");
    t.datetime("createdAt");
    t.datetime("updatedaAt");
  },
});
