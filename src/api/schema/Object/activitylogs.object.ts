import { objectType } from "nexus";

export const ActivityLogsObject = objectType({
  name: "activityLogs",
  definition(t) {
    t.id("logsID");
    t.string("title");
    t.string("description");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
