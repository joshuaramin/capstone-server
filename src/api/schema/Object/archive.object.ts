import { objectType } from "nexus";

export const ArchiveObject = objectType({
  name: "archive",
  definition(t) {
    t.id("archiveID");
    t.datetime("createdaAt");
    t.datetime("updatedAt");
  },
});
