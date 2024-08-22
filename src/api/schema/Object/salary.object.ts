import { objectType } from "nexus";

export const SalaryObject = objectType({
  name: "salary",
  definition(t) {
    t.id("salaryID");
    t.float("fixed");
    t.float("max");
    t.float("min");
    t.string("currency");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
