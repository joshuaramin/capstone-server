import { booleanArg, extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

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
    t.field("updateCompany", {
      type: "company",
      args: { companyID: nonNull(idArg()), verified: nonNull(booleanArg()) },
      resolve: async (_, { companyID }): Promise<any> => {
        return await prisma.company.update({
          where: { companyID },
          data: {
            verified: true,
          },
        });
      },
    });
  },
});
