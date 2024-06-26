import { objectType } from "nexus";

export const NotificationJob = objectType({
  name: "notification",
  definition(t) {
    t.id("notificationID");
    t.boolean("read");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
