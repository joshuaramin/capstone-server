import { objectType } from "nexus";

export const MessageObject = objectType({
  name: "message",
  definition(t) {
    t.id("messageID");
    t.string("message");
    t.string("senderID");
    t.string("receiverID");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
