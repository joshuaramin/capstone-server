import { enumType } from "nexus";

export const roleEnum = enumType({
  name: "roleEnum",
  members: ["admin", "recruiter", "freelance"],
});
