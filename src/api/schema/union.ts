import { unionType } from "nexus";

export const UserUnion = unionType({
  name: "UserPayload",
  definition(t) {
    t.members("user", "BADINPUT", "AlreadyExist", "PasswordAlreadyExist");
  },
});

export const ApplicationPayload = unionType({
  name: "ApplicationPayload",
  definition(t) {
    t.members("application", "Forbidden", "BADINPUT", "AlreadyExist");
  },
});

export const EmailAddressPayload = unionType({
  name: "EmailPayload",
  definition(t) {
    t.members("user", "BADINPUT", "NOTFOUND");
  },
});

export const SkillPayload = unionType({
  name: "SkillPayload",
  definition(t) {
    t.members("skills", "BADINPUT", "AlreadyExist");
  },
});

export const CredentailPayload = unionType({
  name: "CredentialsPayload",
  definition(t) {
    t.members("token", "BADINPUT", "CredentialsInvalid", "NOTFOUND");
  },
});

export const SchedulePayload = unionType({
  name: "SchedulePayload",
  definition(t) {
    t.members("schedule", "BADINPUT");
  },
});

export const ResumePayload = unionType({
  name: "ResumePayload",
  definition(t) {
    t.members("resume", "BADINPUT");
  },
});

export const JobPostPayload = unionType({
  name: "JobPostPayload",
  definition(t) {
    t.members("jobpost", "BADINPUT", "Forbidden", "Payment");
  },
});

export const PortfolioPayload = unionType({
  name: "PortfolioPayload",
  definition(t) {
    t.members("portfolio", "BADINPUT");
  },
});

export const SalaryPayload = unionType({
  name: "salaryPayload",
  definition(t) {
    t.members("salary", "BADINPUT");
  },
});

export const ResetPasswordLinkPayload = unionType({
  name: "resetPasswordPayload",
  definition(t) {
    t.members("resetPassword", "Expired", "NOTFOUND");
  },
});

export const FavouritePayload = unionType({
  name: "FavouritePayload",
  definition(t) {
    t.members("favourite", "BADINPUT", "Forbidden");
  },
});

export const AvatarPayload = unionType({
  name: "MediaPayload",
  definition(t) {
    t.members("media", "BADINPUT");
  },
});

export const EducationPayload = unionType({
  name: "EducationPayload",
  definition(t) {
    t.members("education", "BADINPUT");
  },
});

export const AboutPayload = unionType({
  name: "AboutPayload",
  definition(t) {
    t.members("about", "BADINPUT");
  },
});

export const SocialPayload = unionType({
  name: "SocialPayload",
  definition(t) {
    t.members("social", "BADINPUT", "AlreadyExist");
  },
});
