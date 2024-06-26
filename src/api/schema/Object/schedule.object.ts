import { objectType } from "nexus";

export const ScheduleObject = objectType({
  name: "schedule",
  definition(t) {
    t.id("scheduleID");
    t.string("title");
    t.string("description");
    t.datetime("startDate");
    t.datetime("endDate");
    t.string("link");
    t.datetime("createdAt");
    t.datetime("updatedAt");
  },
});
