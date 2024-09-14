import { objectType } from "nexus";

export const EducationObject = objectType({
  name: "education",
  definition(t) {
    t.id("educationID");
    t.string("school");
    t.string("degree");
    t.string("study");
    t.string("startMonth");
    t.string("startYear");
    t.string("endMonth");
    t.string("endYear");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
