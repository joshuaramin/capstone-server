import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

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
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Reset Password Code is Not found",
          };
        }

        const currentDate = new Date();

        if (new Date(pass.expiredAt) < currentDate) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message:
              "The resource you are looking for has been permanently removed. Please check the URL for any spelling mistakes or contact the site administrator if you believe this is an error.",
          };
        }

        return {
          __typename: "resetPassword",
          ...pass,
        };
      },
    });
  },
});
