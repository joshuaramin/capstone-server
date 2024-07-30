import { extendType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const SkillQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllSkill", {
      type: "skills",
      args: { input: "PaginationInput" },
      resolve: async (_, { input: { page, take } }): Promise<any> => {
        return await prisma.skills.findMany({
          take,
          skip: take * (page - 1),
        });
      },
    });
    t.list.field("getSearchBySkill", {
      type: "skills",
      args: { search: nonNull(stringArg()) },
      resolve: async (_, { search }): Promise<any> => {
        return await prisma.skills.findMany({
          where: {
            skills: {
              contains: search,
              mode: "insensitive",
            },
          },
        });
      },
    });
    t.list.field("getSkillsByGroup", {
      type: "skills",
      resolve: async (): Promise<any> => {
        return await prisma.skills.groupBy({
          by: ["skillsID", "skills"],
        });
      },
    });
  },
});
