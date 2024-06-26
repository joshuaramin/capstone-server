import { extendType, idArg, inputObjectType, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ComparePass, PashBcrypt } from "../../helpers/hash";
import { compare } from "bcrypt";

export const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
  },
});

export const UserFreelanceInput = inputObjectType({
  name: "UserFreelanceInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
    t.date("birthday");
  },
});

export const UserRecruiterInput = inputObjectType({
  name: "UserRecruiterInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("firstname");
    t.string("lastname");
    t.phone("phone");
    t.date("birthday");
    t.string("companyName");
    t.string("description");
    t.string("location");
    t.string("companySize");
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserAdminAccount", {
      type: "user",
      args: { input: nonNull("UserInput") },
      resolve: async (
        _,
        { input: { firstname, lastname, password, phone, email } }
      ): Promise<any> => {
        return await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            role: "admin",
            Profile: {
              create: {
                firstname,
                lastname,
                phone,
              },
            },
          },
        });
      },
    });
    t.field("createUserRecreuiters", {
      type: "user",
      args: { input: nonNull("UserRecruiterInput") },
      resolve: async (
        _,
        {
          input: {
            birthday,
            companyName,
            companySize,
            description,
            email,
            firstname,
            lastname,
            location,
            password,
            phone,
          },
        }
      ): Promise<any> => {
        return await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            role: "employee",
            Company: {
              create: {
                companyName,
                companySize,
                description,
                location,
              },
            },
            Profile: {
              create: {
                firstname,
                lastname,
                phone,
                birthday,
              },
            },
          },
        });
      },
    });
    t.field("createUserFreelancers", {
      type: "user",
      args: { input: nonNull("UserFreelanceInput") },
      resolve: async (
        _,
        { input: { email, birthday, firstname, lastname, password, phone } }
      ): Promise<any> => {
        return await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            role: "freelance",
            Profile: {
              create: {
                firstname,
                lastname,
                phone,
                birthday,
              },
            },
          },
        });
      },
    });
    t.field("deleteUserAccount", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.user.delete({
          where: {
            userID,
          },
        });
      },
    });
    t.field("updateUserPasswordAccount", {
      type: "user",
      args: { userID: nonNull(idArg()), password: nonNull(stringArg()) },
      resolve: async (_, { userID, password }): Promise<any> => {
        const users = await prisma.user.findUnique({
          where: { userID },
        });

        if (!users) {
          return {
            //error
          };
        }

        const checkPassHash = await prisma.passwordHash.findMany({
          where: { User: { userID } },
        });

        for (const { passHash } of checkPassHash) {
          const compareBcrypt = await ComparePass(password, passHash);

          if (compareBcrypt) {
            //return error
          }
        }

        await prisma.passwordHash.create({
          data: { passHash: users.password },
        });

        const data = await prisma.user.update({
          where: { userID },
          data: { password: await PashBcrypt(password) },
        });

        return {
          __typename: "user",
          ...data,
        };
      },
    });
    t.field("login", {
      type: "user",
      args: {},
      resolve: async (): Promise<any> => {},
    });
  },
});
