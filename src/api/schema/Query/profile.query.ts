import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ProfileQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getProfileByUser", {
      type: "profile",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.profile.findFirst({
          where: {
            userID,
          },
        });
      },
    });
    t.field("getUserProfileById", {
      type: "profile",
      args: { profileID: nonNull(idArg()) },
      resolve: async (_, { profileID }) => {
        return await prisma.profile.findFirst({
          where: {
            profileID,
          },
        });
      },
    });
  },
});
