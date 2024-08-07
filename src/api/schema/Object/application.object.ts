import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const ApplicationObject = objectType({
  name: "application",
  definition(t) {
    t.id("applicationID");
    t.string("id");
    t.string("status");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("user", {
      type: "user",
      resolve: async ({ applicationID }): Promise<any> => {
        return await prisma.user.findFirst({
          where: {
            Application: {
              some: { applicationID },
            },
          },
        });
      },
    });
    t.field("score", {
      type: "ats",
      resolve: async ({ applicationID }): Promise<any> => {
        return await prisma.applicationScore.findFirst({
          where: { applicationID },
        });
      },
    });
  },
});
