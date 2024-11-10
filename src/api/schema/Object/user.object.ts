import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const UserObject = objectType({
  name: "user",
  definition(t) {
    t.id("userID");
    t.string("email");
    t.string("password");
    t.string("plan");
    t.string("role");
    t.boolean("verified");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.list.field("requirement", {
      type: "requirement",
      resolve: async ({ userID }) => {
        return await prisma.requirements.findMany({
          where: {
            userID,
          },
        });
      },
    });
    t.field("myProfile", {
      type: "profile",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.profile.findFirst({
          where: { userID },
        });
      },
    });
    t.field("getMyCompany", {
      type: "company",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.company.findFirst({
          where: { userID },
        });
      },
    });
    t.list.field("passwordHash", {
      type: "password",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.passwordHash.findMany({
          where: {
            userID,
          },
        });
      },
    });
    t.list.field("getMyApplication", {
      type: "application",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.application.findMany({
          where: {
            userID,
          },
        });
      },
    });
    t.list.field("getMyLogs", {
      type: "activityLogs",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.activityLogs.findMany({
          where: {
            userID,
          },
        });
      },
    });
    t.list.field("getMyNotification", {
      type: "notification",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.notification.findMany({
          where: { userID },
        });
      },
    });
    t.list.field("receiverList", {
      type: "message",
      resolve: async ({ userID }) => {
        return await prisma.message.findMany({
          where: {
            sender: {
              userID,
            },
          },
        });
      },
    });
    t.list.field("senderList", {
      type: "message",
      resolve: async ({ userID }) => {
        return await prisma.message.findMany({
          where: {
            receiver: {
              userID,
            },
          },
        });
      },
    });
    t.list.field("messages", {
      type: "message",
      resolve: async ({ userID }): Promise<any> => {
        return await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderID: userID,
              },
              {
                receiverID: userID,
              },
            ],
          },
        });
      },
    });
    t.list.field("projectOrganizer", {
      type: "project",
      resolve: async ({ userID }) => {
        return await prisma.projectOrganizer.findMany({
          where: {
            userID,
          },
        });
      },
    });
    t.list.field("review", {
      type: "review",
      resolve: async ({ userID }) => {
        return await prisma.review.findMany({
          where: {
            userID,
          },
        });
      },
    });
  },
});

export const TokenObject = objectType({
  name: "token",
  definition(t) {
    t.id("userID");
    t.string("role");
    t.string("token");
    t.field("user", {
      type: "user",
      resolve: async ({ userID }) => {
        return await prisma.user.findFirst({
          where: {
            userID,
          },
        });
      },
    });
  },
});
