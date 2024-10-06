import { objectType } from "nexus";
import { prisma } from "../../helpers/server";

export const Project = objectType({
  name: "project",
  definition(t) {
    t.id("projectOrganizerID");
    t.string("title");
    t.string("status");
    t.float("amount");
    t.datetime("startDate");
    t.datetime("endDate");
    t.datetime("createdAt");
    t.datetime("updatedAt");
    t.field("company", {
      type: "company",
      resolve: async ({ projectOrganizerID }) => {
        return await prisma.company.findFirst({
          where: {
            Organizer: {
              some: {
                projectOrganizerID,
              },
            },
          },
        });
      },
    });
  },
});
