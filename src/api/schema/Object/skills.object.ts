import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const SkillsObject = objectType({
  name: "skills",
  definition(t) {
    t.id("skillsID");
    t.string("skills");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.int("jobCount", {
      resolve: async ({ skillsID }): Promise<any> => {
        return await prisma.jobPost.count({
          where: {
            Skills: {
              every: {
                skillsID,
              },
            },
          },
        });
      },
    });
  },
});

export const groupSkills = objectType({
  name: "skillsGroup",
  definition(t) {
    t.string("skills");
    t.int("count");
  },
});
