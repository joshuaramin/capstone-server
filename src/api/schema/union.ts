import { unionType } from "nexus";

export const UserUnion = unionType({
  name: "UserPayload",
  definition(t) {
    t.members("user", "BADINPUT");
  },
});

export const UserAuthUnioin = unionType({
  name: "UserAuthUnion",
  definition(t) {
    t.members("user", "BADINPUT", "Forbidden");
  },
});
