import { objectType } from "nexus";

export const MessageStatus = objectType({
  name: "MessageStatus",
  definition(t) {
    t.id("messageStatusID");
    t.boolean("isRead");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
