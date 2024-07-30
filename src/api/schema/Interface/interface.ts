import { interfaceType } from "nexus";

export const ErrorInterface = interfaceType({
  name: "Error",
  definition(t) {
    t.string("message");
    t.int("code");
  },
});
