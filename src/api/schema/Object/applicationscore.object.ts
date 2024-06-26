import { objectType } from "nexus";

export const ApplicatioNScoreObject = objectType({
  name: "ats",
  definition(t) {
    t.id("applicationID");
    t.float("score");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
