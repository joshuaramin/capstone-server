import { objectType } from "nexus";

export const ResetPasswordLinkObject = objectType({
  name: "resetPassword",
  definition(t) {
    t.id("resetPassID");
    t.string("reset");
    t.datetime("expiredAt");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
