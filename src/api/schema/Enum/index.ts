import { enumType } from "nexus";

export const experienceEnum = enumType({
  name: "experienceEnum",
  members: ["Entry", "Intermediate", "Expert", "Senior"],
});

export const roleEnum = enumType({
  name: "roleEnum",
  members: ["admin", "recruiter", "freelance"],
});
