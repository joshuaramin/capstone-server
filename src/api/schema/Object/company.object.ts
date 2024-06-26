import { objectType } from "nexus";

export const CompanyObject = objectType({
  name: "company",
  definition(t) {
    t.id("companyID");
    t.string("companyName");
    t.string("description");
    t.string("location");
    t.string("companySize");
  },
});
