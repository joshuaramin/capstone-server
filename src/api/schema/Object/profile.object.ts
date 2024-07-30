import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const ProfileObject = objectType({
  name: "profile",
  definition(t) {
    t.id("profileID");
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
    t.date("birthday");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("avatar", {
      type: "media",
      resolve: async ({ profileID }): Promise<any> => {
        return await prisma.media.findFirst({
          where: { profileID },
        });
      },
    });
    t.field("about", {
      type: "about",
      resolve: async ({ profileID }): Promise<any> => {
        return await prisma.about.findFirst({
          where: { profileID },
        });
      },
    });
    t.list.field("getMyResume", {
      type: "resume",
      resolve: async ({ profileID }): Promise<any> => {
        return await prisma.resume.findMany({
          where: { profileID },
        });
      },
    });
    t.list.field("getMySkills", {
      type: "skills",
      resolve: async ({ profileID }): Promise<any> => {
        return await prisma.skills.findMany({
          where: { profileID },
        });
      },
    });
  },
});
