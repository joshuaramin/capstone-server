import { unionType } from "nexus";

export const UserUnion = unionType({
  name: "UserPayload",
  definition(t) {
    t.members("user", "ErrorObject");
  },
});

export const ApplicationPayload = unionType({
  name: "ApplicationPayload",
  definition(t) {
    t.members("application", "ErrorObject");
  },
});

export const EmailAddressPayload = unionType({
  name: "EmailPayload",
  definition(t) {
    t.members("user", "ErrorObject");
  },
});

export const SkillPayload = unionType({
  name: "SkillPayload",
  definition(t) {
    t.members("skills", "ErrorObject");
  },
});

export const CredentailPayload = unionType({
  name: "CredentialsPayload",
  definition(t) {
    t.members("token", "ErrorObject");
  },
});

export const SchedulePayload = unionType({
  name: "SchedulePayload",
  definition(t) {
    t.members("schedule", "ErrorObject");
  },
});

export const ResumePayload = unionType({
  name: "ResumePayload",
  definition(t) {
    t.members("resume", "ErrorObject");
  },
});

export const JobPostPayload = unionType({
  name: "JobPostPayload",
  definition(t) {
    t.members("jobpost", "ErrorObject");
  },
});

export const PortfolioPayload = unionType({
  name: "PortfolioPayload",
  definition(t) {
    t.members("portfolio", "ErrorObject");
  },
});

export const SalaryPayload = unionType({
  name: "salaryPayload",
  definition(t) {
    t.members("salary", "ErrorObject");
  },
});

export const ResetPasswordLinkPayload = unionType({
  name: "resetPasswordPayload",
  definition(t) {
    t.members("resetPassword", "ErrorObject");
  },
});

export const FavouritePayload = unionType({
  name: "FavouritePayload",
  definition(t) {
    t.members("favourite", "ErrorObject");
  },
});

export const AvatarPayload = unionType({
  name: "MediaPayload",
  definition(t) {
    t.members("media", "ErrorObject");
  },
});

export const EducationPayload = unionType({
  name: "EducationPayload",
  definition(t) {
    t.members("education", "ErrorObject");
  },
});

export const AboutPayload = unionType({
  name: "AboutPayload",
  definition(t) {
    t.members("about", "ErrorObject");
  },
});

export const SocialPayload = unionType({
  name: "SocialPayload",
  definition(t) {
    t.members("social", "ErrorObject");
  },
});
