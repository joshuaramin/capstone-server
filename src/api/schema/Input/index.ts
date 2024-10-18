import { inputObjectType } from "nexus";

export const SalaryInput = inputObjectType({
  name: "salaryInput",
  definition(t) {
    t.nullable.int("fixed");
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
    t.date("startDate");
    t.date("endDate");
    t.string("startTime");
    t.string("endTime");
    t.int("duration");
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
    t.phone("phone");
    t.date("birthday");
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
    t.string("status"), t.string("isOpen");
    t.list.string("JobType");
    t.string("experience");
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

export const PortfolioInput = inputObjectType({
  name: "PortfolioInput",
  definition(t) {
    t.string("companyName");
    t.string("description");
    t.string("employmentType");
    t.string("startMonth");
    t.string("startYear");
    t.string("endMonth");
    t.string("endYear");
    t.string("location");
    t.string("locationType");
    t.string("title");
  },
});

export const EducationInput = inputObjectType({
  name: "EducationInput",
  definition(t) {
    t.string("school");
    t.string("degree");
    t.string("study");
    t.string("startMonth");
    t.string("startYear");
    t.string("endMonth");
    t.string("endYear");
  },
});
