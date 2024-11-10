import { objectType } from "nexus";

export const PaypalObjet = objectType({
  name: "PaypalObject",
  definition(t) {
    t.string("reason");
  },
});
