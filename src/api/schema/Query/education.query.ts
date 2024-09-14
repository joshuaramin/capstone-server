import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const EducationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllEducationByProfileId", {
      type: "education",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.education.findMany({
          where: {
            profileID,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      },
    });
    t.field("getEducationById", {
      type: "education",
      args: { educationID: nonNull(idArg()) },
      resolve: async (_, { educationID }): Promise<any> => {
        return await prisma.education.findFirst({
          where: { educationID },
        });
      },
    });
  },
});
