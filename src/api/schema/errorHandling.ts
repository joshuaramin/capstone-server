import { interfaceType, objectType } from "nexus";

export const ErrorInterface = interfaceType({
  name: "Error",
  definition(t) {
    t.string("message");
    t.int("code");
  },
});

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
