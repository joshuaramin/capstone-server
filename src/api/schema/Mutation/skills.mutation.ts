import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const SkillsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSkills", {
      type: "SkillPayload",
      args: { input: nonNull("SkillInput") },
      resolve: async (_, { input: { skills } }): Promise<any> => {
        if (!skills) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const skill = await prisma.skills.create({
          data: {
            skills,
          },
        });

        return {
          __typename: "skills",
          ...skill,
        };
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
        if (!skills) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const skill = await prisma.skills.update({
          data: { skills },
          where: { skillsID },
        });

        return {
          __typename: "skills",
          ...skill,
        };
      },
    });
  },
});
