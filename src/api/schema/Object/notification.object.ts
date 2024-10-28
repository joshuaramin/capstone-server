import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const NotificationJob = objectType({
  name: "notification",
  definition(t) {
    t.id("notificationID");
    t.string("title");
    t.boolean("read");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.list.field("company", {
      type: "company",
      resolve: async ({ notificationID }) => {
        return await prisma.company.findMany({
          where: { Notification: { some: { notificationID } } },
        });
      },
    });
    t.list.field("project", {
      type: "project",
      resolve: async ({ notificationID }) => {
        return await prisma.projectOrganizer.findMany({
          where: {
            Notification: { some: { notificationID } },
          },
        });
      },
    });
    t.field("application", {
      type: "application",
      resolve: async ({ notificationID }) => {
        return await prisma.application.findFirst({
          where: { Notification: { some: { notificationID } } },
        });
      },
    });
    t.field("schedule", {
      type: "schedule",
      resolve: async ({ notificationID }) => {
        return await prisma.schedule.findFirst({
          where: {
            Notification: { some: { notificationID } },
          },
        });
      },
    });
  },
});

export const NotificationUnreadObject = objectType({
  name: "UnReadNotification",
  definition(t) {
    t.int("unreadNotification");
  },
});
