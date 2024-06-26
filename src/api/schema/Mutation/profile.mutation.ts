import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ProfileInput = inputObjectType({
  name: "ProfileInput",
  definition(t) {
    t.string("firstname");
    t.string("lastname");
    t.string("phone");
    t.date("birthday");
  },
});

export const ProfileMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateProfile", {
      type: "profile",
      args: { profileID: nonNull(idArg()), input: nonNull("ProfileInput") },
      resolve: async (
        _,
        { profileID, input: { firstname, lastname, birthday, phone } }
      ): Promise<any> => {
        return await prisma.profile.update({
          where: { profileID },
          data: { firstname, lastname, birthday, phone },
        });
      },
    });
  },
});
