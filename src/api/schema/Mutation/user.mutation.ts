import { extendType, idArg, list, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ComparePass, PashBcrypt } from "../../helpers/hash";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

import {
  EMAIL_ADDRESS_NOT_FOUND,
  ERROR_ALREADY_EXIST,
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_CREDENTIALS,
  ERROR_PASSWORD_ALREADY_EXIST,
} from "../../helpers/error";

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
      resolve: async (
        _,
        { input: { firstname, lastname, password, email, phone, birthday } }
      ): Promise<any> => {
        if (!firstname || !lastname || !password || !email || !birthday) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const emailCheck = await prisma.user.findUnique({
          where: { email },
        });

        if (emailCheck) {
          return {
            __typename: "AlreadyExist",
            code: 409,
            message: " Email Address is Already Exist.",
          };
        }

        const users = await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            role: "admin",
            verified: true,
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
      args: { input: nonNull("UserRecruiterInput"), file: nonNull("Upload") },
      resolve: async (
        _,
        {
          input: {
            companyName,
            companySize,
            description,
            email,
            plan,
            firstname,
            lastname,
            location,
            password,
          },
          file,
        }
      ): Promise<any> => {
        if (
          !companyName ||
          !companySize ||
          !description ||
          !email ||
          !plan ||
          !firstname ||
          !lastname ||
          !location ||
          !password
        ) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const emailCheck = await prisma.user.findUnique({
          where: { email },
        });

        if (emailCheck) {
          return {
            __typename: "AlreadyExist",
            code: 409,
            message: " Email Address is Already Exist.",
          };
        }

        const { createReadStream, filename } = await file;
        const users = await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            plan,
            role: "recruiter",
            Company: {
              create: {
                companyName,
                slug: Slugify(companyName),
                companySize,
                description,
                location,
                media: {
                  create: {
                    media: await uploader(createReadStream()),
                  },
                },
              },
            },
            Profile: {
              create: {
                firstname,
                lastname,
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
        RecruitersInstruction(users.email, `${firstname} ${lastname}`);
        VerificationEmail(
          users.email,
          `${firstname} ${lastname}`,
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
        {
          input: { email, firstname, lastname, password },
          requirement: { type },
          fileUpload,
          skills,
        }
      ): Promise<any> => {
        if (!email || !firstname || !lastname || !password) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const checkUserEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (checkUserEmail) {
          return ERROR_ALREADY_EXIST;
        }

        const { createReadStream, filename } = await fileUpload;
        const users = await prisma.user.create({
          data: {
            email,
            password: await PashBcrypt(password),
            role: "freelance",
            Profile: {
              create: {
                firstname,
                lastname,
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

        FreelancerVerificationEmail(users.email, `${firstname} ${lastname}`);

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
        return await prisma.user.delete({
          where: {
            userID,
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
          return ERROR_MESSAGE_BAD_INPUT;
        }

        if (!users) {
          return EMAIL_ADDRESS_NOT_FOUND;
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
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const checkPassHash = await prisma.passwordHash.findMany({
          where: { User: { userID } },
        });

        for (const { passHash } of checkPassHash) {
          const compareBcrypt = await ComparePass(password, passHash);

          if (compareBcrypt) {
            return ERROR_PASSWORD_ALREADY_EXIST;
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

        if (user.email === email) {
          return {
            __typename: "BADINPUT",
            code: 400,
            message: "Email is already exist.",
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
    t.field("login", {
      type: "CredentialsPayload",
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }, { req, res }): Promise<any> => {
        if (!email || !password) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const users = await prisma.user.findUnique({
          where: { email },
        });

        if (!users) {
          return EMAIL_ADDRESS_NOT_FOUND;
        }

        const valid = await ComparePass(password, users?.password);

        if (!valid) {
          return ERROR_MESSAGE_CREDENTIALS;
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
            __typename: "BADINPUT",
            code: 401,
            message: "You need to verify your account first",
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
  },
});
