import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_EXPIRED, ERROR_NOT_FOUND } from "../../helpers/error";

export const ResetPasswordQuery = extendType({
  type: "Mutation",
  definition(t) {
    t.field("getMyResetPasswordLink", {
      type: "resetPasswordPayload",
      args: { reset: nonNull(stringArg()) },
      resolve: async (_, { reset }): Promise<any> => {
        const pass = await prisma.resetPassword.findFirst({
          where: { reset: reset },
        });

        if (!pass) {
          return ERROR_NOT_FOUND;
        }

        const currentDate = new Date();

        if (new Date(pass.expiredAt) < currentDate) {
          return ERROR_EXPIRED;
        }

        return {
          __typename: "resetPassword",
          ...pass,
        };
      },
    });
  },
});
