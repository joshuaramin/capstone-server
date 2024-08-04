import { objectType } from "nexus";

export const BadInputObject = objectType({
  name: "BADINPUT",
  definition(t) {
    t.implements("Error");
  },
});

export const ForbiddenObject = objectType({
  name: "Forbidden",
  definition(t) {
    t.implements("Error");
  },
});

export const AlreadyExist = objectType({
  name: "AlreadyExist",
  definition(t) {
    t.implements("Error");
  },
});

export const CredentialsInvalid = objectType({
  name: "CredentialsInvalid",
  definition(t) {
    t.implements("Error");
  },
});

export const NOTFOUND = objectType({
  name: "NOTFOUND",
  definition(t) {
    t.implements("Error");
  },
});

export const EXPIRED = objectType({
  name: "Expired",
  definition(t) {
    t.implements("Error");
  },
});
