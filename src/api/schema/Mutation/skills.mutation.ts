import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const SkillInput = inputObjectType({
  name: "SkillInput",
  definition(t) {
    t.string("skills");
  },
});

export const SkillsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSkills", {
      type: "skills",
      args: { input: nonNull("SkillInput") },
      resolve: async (_, { input: { skills } }): Promise<any> => {
        return await prisma.skills.create({
          data: {
            skills,
          },
        });
      },
    });
    t.field("deleteSkills", {
      type: "skills",
      args: { skillsID: nonNull(idArg()) },
      resolve: async (_, { skillsID }): Promise<any> => {
        return await prisma.skills.delete({ where: { skillsID } });
      },
    });
    t.field("updateSkills", {
      type: "skills",
      args: { skillsID: nonNull(idArg()), input: nonNull("SkillInput") },
      resolve: async (_, { input: { skills }, skillsID }): Promise<any> => {
        return await prisma.skills.update({
          data: { skills },
          where: { skillsID },
        });
      },
    });
  },
});
