import { subscriptionType } from "nexus";
import { prisma } from "../../helpers/server";

export const SystemSubscriptions = subscriptionType({
  definition(t) {
    t.list.field("getAllUser", {
      type: "user",
      subscribe: async (): Promise<any> => {},
      resolve: async (payload): Promise<any> => {
        return payload;
      },
    });
    t.list.field("jobPost", {
      type: "jobpost",
      subscribe: async (): Promise<any> => {},
      resolve: async (payload): Promise<any> => {
        return payload;
      },
    });
  },
});
