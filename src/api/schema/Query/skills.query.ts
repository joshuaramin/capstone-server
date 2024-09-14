import { extendType, idArg, nonNull, stringArg } from "nexus";
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
    t.field("skillsPagination", {
      type: "SkillsPagination",
      args: { input: nonNull("PaginationInput"), search: nonNull(stringArg()) },
      resolve: async (_, { input: { page, take }, search }): Promise<any> => {
        const getAllSkills = await prisma.skills.findMany({
          where: {
            skills: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const offset = (page - 1) * take;
        const item = getAllSkills.slice(offset, offset + take);
        return {
          item,
          totalPages: Math.ceil(getAllSkills.length / take),
          totalItems: getAllSkills.length,
          currentPage: page,
          hasNextPage: page < Math.ceil(getAllSkills.length / take),
          hasPrevPage: page > 1,
        };
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
    t.list.field("getSkillByProfileID", {
      type: "skills",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.skills.findMany({
          where: { Profile: { some: { profileID } } },
        });
      },
    });
  },
});
