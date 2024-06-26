import { objectType } from "nexus";

export const PasswordObject = objectType({
  name: "password",
  definition(t) {
    t.id("passwordID");
    t.string("password");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
