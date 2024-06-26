import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const CompanyInput = inputObjectType({
  name: "CompanyInput",
  definition(t) {
    t.string("companyName");
    t.string("companySize");
    t.string("description");
    t.string("location");
  },
});

export const CompanyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCompany", {
      type: "company",
      args: { companyID: nonNull(idArg()), input: nonNull("CompanyInput") },
      resolve: async (_, { companyID, input }) => {
        return await prisma.company.update({
          data: {
            ...input,
          },
          where: {
            companyID,
          },
        });
      },
    });
  },
});
