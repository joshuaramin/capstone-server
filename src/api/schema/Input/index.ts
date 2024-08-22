import { inputObjectType } from "nexus";

export const SalaryInput = inputObjectType({
  name: "salaryInput",
  definition(t) {
    t.nullable.int("fixed")
    t.nullable.float("min");
    t.nullable.float("max");
    t.string("currency");
  },
});

export const ScheduleInput = inputObjectType({
  name: "ScheduleInput",
  definition(t) {
    t.string("title");
    t.string("description");
    t.datetime("startDate");
    t.datetime("endDate");
    t.string("link");
  },
});

export const SkillInput = inputObjectType({
  name: "SkillInput",
  definition(t) {
    t.string("skills");
  },
});

export const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("firstname");
    t.string("lastname");
  },
});

export const UserFreelanceInput = inputObjectType({
  name: "UserFreelanceInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("firstname");
    t.string("lastname");
  },
});

export const UserRecruiterInput = inputObjectType({
  name: "UserRecruiterInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("plan");
    t.string("firstname");
    t.string("lastname");
    t.string("companyName");
    t.string("description");
    t.string("location");
    t.string("companySize");
  },
});
  
export const JobPostInput = inputObjectType({
  name: "jobPostInput",
  definition(t) {
    t.string("title");
    t.string("description");
    t.string("location");
    t.string("duration");
    t.string("status"),
    t.string("isOpen")
    t.list.string("JobType");
    t.date("endDate");
    t.string("experience")
  },
});

export const CompanyInput = inputObjectType({
  name: "CompanyInput",
  definition(t) {
    t.string("companyName");
    t.string("companySize");
    t.string("description");
    t.string("location");
  },
});

export const RequirementInput = inputObjectType({
  name: "RequirementInput",
  definition(t) {
    t.string("type");
  },
});
