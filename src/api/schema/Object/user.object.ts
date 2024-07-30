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
  },
});

export const TokenObject = objectType({
  name: "token",
  definition(t) {
    t.id("userID");
    t.string("role");
    t.string("token");
  },
});
