import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const SalaryMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateJobSalary", {
      type: "salaryPayload",
      args: { salaryID: nonNull(idArg()), input: nonNull("salaryInput") },
      resolve: async (
        _,
        { salaryID, input: { min, max, currency } }
      ): Promise<any> => {
        if (!min || !min || !currency) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const salary = await prisma.salary.update({
          data: {
            max,
            min,
            currency,
          },
          where: { salaryID },
        });

        return {
          __typename: "salary",
          ...salary,
        };
      },
    });
  },
});
