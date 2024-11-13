import {
  extendType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  stringArg,
} from "nexus";
import { prisma } from "../../helpers/server";
import Skills from "../../../skills.json";

export const SkillsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSkills", {
      type: "SkillPayload",
      args: { input: nonNull("SkillInput") },
      resolve: async (_, { input: { skills } }): Promise<any> => {
        if (!skills) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Skills is required",
          };
        }

        const ujSkill = await prisma.skills.findUnique({
          where: { skills },
        });

        if (ujSkill) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Skill is already exist.",
          };
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
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Skills is required",
          };
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
    t.list.field("addSkills", {
      type: "skills",

      resolve: async (): Promise<any> => {
        await prisma.skills.createMany({
          data: Skills.map(({ skills }) => {
            return {
              skills,
            };
          }),
          skipDuplicates: true,
        });
      },
    });
  },
});
