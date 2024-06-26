import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ResumeQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getAllResumyByProfileID", {
      type: "resume",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }): Promise<any> => {
        return await prisma.resume.findMany({
          where: { profileID },
        });
      },
    });
  },
});
