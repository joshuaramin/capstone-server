import { objectType } from "nexus";

export const MessageStatus = objectType({
  name: "MessageStatus",
  definition(t) {
    t.id("messageStatus");
    t.boolean("isRead");
    t.datetime("createAt");
    t.datetime("updatedAt");
  },
});
