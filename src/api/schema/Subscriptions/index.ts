import { subscriptionType } from "nexus";
import { prisma, pubsub } from "../../helpers/server";

export const SystemSubscriptions = subscriptionType({
  definition(t) {
    t.list.field("getAllUser", {
      type: "user",
      subscribe: async (): Promise<any> => {
        pubsub.asyncIterator("createUserAccount");
      },
      resolve: async (payload): Promise<any> => {
        return payload;
      },
    });
    t.list.field("jobPost", {
      type: "jobpost",
      subscribe: async (): Promise<any> => {
        pubsub.asyncIterator("createjobPost");
      },
      resolve: async (payload): Promise<any> => {
        return payload;
      },
    });
  },
});
