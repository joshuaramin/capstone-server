import { extendType, idArg, list, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ComparePass, PashBcrypt } from "../../helpers/hash";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

import generateRandom from "../../helpers/generateRandom";
import {
  AccountDeactivation,
  ChangeEmailAddress,
  FreelancerVerificationEmail,
  RecruitersInstruction,
  ResetPasswordLink,
  VerificationEmail,
} from "../../helpers/sendgrid";
import { uploader } from "../../helpers/cloudinary";
import { Slugify } from "../../helpers/slugify";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserAdminAccount", {
      type: "UserPayload",
      args: { input: nonNull("UserInput") },
      resolve: async (_, { input }): Promise<any> => {
        for (const key in input) {
          if (input.hasOwnProperty(key)) {
            if (!input[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key}is required`,
              };
            }
          }
        }

        const emailCheck = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (emailCheck) {
          return {
            __typename: "ErrorObject",
            code: 409,
            message: "Email Address is already existing",
          };
        }

        const users = await prisma.user.create({
          data: {
            email: input.email,
            password: await PashBcrypt(input.password),
            role: "admin",
            verified: true,
            Profile: {
              create: {
                firstname: input.firstname,
                lastname: input.lastname,
                phone: input.phone,
                birthday: input.birthday,
              },
            },
          },
        });
        await prisma.passwordHash.create({
          data: {
            passHash: users.password,
            User: {
              connect: {
                userID: users.userID,
              },
            },
          },
        });
        return {
          __typename: "user",
          success: 200,
          ...users,
        };
      },
    });
    t.field("createUserRecruiter", {
      type: "UserPayload",
      args: {
        input: nonNull("UserRecruiterInput"),
        file: nonNull("Upload"),
        subscriptionId: stringArg(),
      },
      resolve: async (_, { input, subscriptionId, file }): Promise<any> => {
        for (const key in input) {
          if (input.hasOwnProperty(key)) {
            if (!input[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key}is required`,
              };
            }
          }
        }

        const emailCheck = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (emailCheck) {
          return {
            __typename: "ErrorObject",
            code: 409,
            message: "Email Address is already existing",
          };
        }

        const { createReadStream, filename } = await file;
        const users = await prisma.user.create({
          data: {
            email: input.email,
            password: await PashBcrypt(input.password),
            plan: input.plan,
            role: "recruiter",
            Company: {
              create: {
                companyName: input.companyName,
                slug: Slugify(input.companyName),
                companySize: input.companySize,
                description: input.location,
                location: input.location,
                media: {
                  create: {
                    media: await uploader(createReadStream()),
                  },
                },
              },
            },
            Profile: {
              create: {
                firstname: input.firstname,
                lastname: input.lastname,
              },
            },
          },
        });

        if (input.plan === "PRO") {
          await prisma.subscription.create({
            data: {
              subscriptionId,
              userID: users.userID,
            },
          });
        }
        await prisma.passwordHash.create({
          data: {
            passHash: users.password,
            User: {
              connect: {
                userID: users.userID,
              },
            },
          },
        });
        RecruitersInstruction(
          users.email,
          `${input.firstname} ${input.lastname}`
        );
        VerificationEmail(
          users.email,
          `${input.firstname} ${input.lastname}`,
          users.userID
        );

        return {
          __typename: "user",
          ...users,
        };
      },
    });
    t.field("createUserFreelancers", {
      type: "UserPayload",
      args: {
        input: nonNull("UserFreelanceInput"),
        requirement: "RequirementInput",
        skills: nonNull(list(stringArg())),
        fileUpload: nonNull("Upload"),
      },
      resolve: async (
        _,
        { input, requirement: { type }, fileUpload, skills }
      ): Promise<any> => {
        for (const key in input) {
          if (input.hasOwnProperty(key)) {
            if (!input[key]) {
              return {
                __typename: "ErrorObject",
                code: 400,
                message: `${key}is required`,
              };
            }
          }
        }

        const checkUserEmail = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (checkUserEmail) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is already exist",
          };
        }

        const { createReadStream, filename } = await fileUpload;
        const users = await prisma.user.create({
          data: {
            email: input.email,
            password: await PashBcrypt(input.password),
            role: "freelance",
            Profile: {
              create: {
                firstname: input.firstname,
                lastname: input.lastname,
                Skills: {
                  connect: skills.map((skilled) => {
                    return { skills: skilled };
                  }),
                },
              },
            },
            Requirement: {
              create: {
                type,
                requirement: await uploader(createReadStream()),
              },
            },
          },
        });

        await prisma.passwordHash.create({
          data: {
            passHash: users.password,
            User: {
              connect: {
                userID: users.userID,
              },
            },
          },
        });

        FreelancerVerificationEmail(
          users.email,
          `${input.firstname} ${input.lastname}`
        );

        return {
          __typename: "user",
          ...users,
        };
      },
    });
    t.field("deleteUserAccount", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.user.update({
          where: {
            userID,
          },
          data: {
            isArchive: true,
          },
        });
      },
    });

    t.field("deactivateMyAccount", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }) => {
        const users = await prisma.user.findUnique({
          where: { userID },
          include: {
            Profile: true,
          },
        });

        AccountDeactivation(
          users.email,
          `${users.Profile.firstname} ${users.Profile.lastname}`
        );

        return await prisma.user.update({
          data: {
            isArchive: true,
          },
          where: {
            userID,
          },
        });
      },
    });
    t.field("findMyEmailAddress", {
      type: "EmailPayload",
      args: { email: nonNull(stringArg()) },
      resolve: async (_, { email }): Promise<any> => {
        const users = await prisma.user.findUnique({
          where: { email },
          include: {
            Profile: true,
          },
        });

        if (!email) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is required",
          };
        }

        if (!users) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is Not Found",
          };
        }

        const date = new Date();
        const expireDate = new Date(date.getTime() + 60 * 60 * 1000);

        const resetLink = await prisma.resetPassword.create({
          data: {
            reset: generateRandom(8),
            expiredAt: expireDate,
            User: {
              connect: {
                userID: users.userID,
              },
            },
          },
        });

        /// sendgrid: send an email to the user if the user is exist.

        ResetPasswordLink(
          users.email,
          resetLink.reset,
          `${users.Profile.firstname} ${users.Profile.lastname}`,
          users.userID
        );

        return {
          __typename: "user",
          ...users,
        };
      },
    });
    t.field("updateUserPasswordAccount", {
      type: "UserPayload",
      args: { userID: nonNull(idArg()), password: nonNull(stringArg()) },
      resolve: async (_, { userID, password }): Promise<any> => {
        const users = await prisma.user.findUnique({
          where: { userID },
        });

        if (!password) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Password is required",
          };
        }

        const checkPassHash = await prisma.passwordHash.findMany({
          where: { User: { userID } },
        });

        for (const { passHash } of checkPassHash) {
          const compareBcrypt = await ComparePass(password, passHash);

          if (compareBcrypt) {
            return {
              __typename: "ErrorObject",
              code: 400,
              message:
                "Your new password cannot be the same as your current or any previous passwords",
            };
          }
        }

        await prisma.passwordHash.create({
          data: {
            passHash: users.password,
            User: {
              connect: { userID },
            },
          },
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
    t.field("verifyMyAccount", {
      type: "user",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }): Promise<any> => {
        return await prisma.user.update({
          where: { userID },
          data: { verified: true },
        });
      },
    });
    t.field("ChangeEmailAddress", {
      type: "UserPayload",
      args: { userID: nonNull(idArg()), email: nonNull(stringArg()) },
      resolve: async (_, { userID, email }): Promise<any> => {
        const user = await prisma.user.findUnique({
          where: { userID },
          include: {
            Profile: true,
          },
        });

        const userEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (userEmail) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is already existing.",
          };
        }

        if (user.email === email) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is already existing.",
          };
        }

        await prisma.activityLogs.create({
          data: {
            title: "Email Address Changed",
            description: "You updated your Email Address",
            User: {
              connect: { userID },
            },
          },
        });

        await ChangeEmailAddress(
          email,
          `${user?.Profile.firstname} ${user?.Profile.lastname}`,
          user?.userID
        );

        const users = await prisma.user.update({
          where: { userID },
          data: {
            email,
            verified: false,
          },
        });

        return {
          __typename: "user",
          ...users,
        };
      },
    });
    t.field("updateUserProfile", {
      type: "user",
      args: { userID: nonNull(idArg()), input: "ProfileInput" },
      resolve: async (_, { userID, input: { firstname, lastname, phone } }) => {
        return await prisma.user.update({
          where: {
            userID,
          },
          data: {
            Profile: {
              update: {
                firstname,
                lastname,
                phone,
              },
            },
          },
        });
      },
    });
    t.field("login", {
      type: "CredentialsPayload",
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }, { req, res }): Promise<any> => {
        if (!email) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is required",
          };
        }

        const users = await prisma.user.findUnique({
          where: { email },
        });

        if (!users) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address does not exist",
          };
        }

        const valid = await ComparePass(password, users?.password);

        if (!valid) {
          return {
            __typename: "ErrorObject",
            code: 401,
            message: "Email Address or Password is incorrect",
          };
        }

        if (users.isArchive === true) {
          return await prisma.user.update({
            where: { email },
            data: {
              isArchive: false,
            },
          });
        }

        if (users.verified === false) {
          return {
            __typename: "ErrorObject",
            code: 401,
            message: "Account must be verified",
          };
        }

        await prisma.activityLogs.create({
          data: {
            title: "Logged In",
            description: "You logged into your account.",
            User: {
              connect: {
                email,
              },
            },
          },
        });

        const token = sign(
          { userID: users.userID, role: users.role },
          "BeeHired",
          {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 7 * 24,
          }
        );

        res.cookie("access_token", token);

        return {
          __typename: "token",
          userID: users.userID,
          role: users.role,
          token,
          ...users,
        };
      },
    });
    t.field("checkMyEmailAddress", {
      type: "EmailPayload",
      args: { email: nonNull(stringArg()) },
      resolve: async (_, { email }) => {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (user) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Email Address is already exist",
          };
        }

        return {
          __typename: "user",
          ...user,
        };
      },
    });
  },
});
