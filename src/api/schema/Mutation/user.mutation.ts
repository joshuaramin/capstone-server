import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { ComparePass, PashBcrypt } from "../../helpers/hash";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;

import {
  EMAIL_ADDRESS_NOT_FOUND,
  ERROR_ALREADY_EXIST,
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_CREDENTIALS,
} from "../../helpers/error";

import generateRandom from "../../helpers/generateRandom";
import {
  FreelancerVerificationEmail,
  RecruitersInstruction,
  ResetPasswordLink,
  VerificationEmail,
} from "../../helpers/sendgrid";
import { uploader } from "../../helpers/cloudinary";
import slugify from "slugify";
import { Slugify } from "../../helpers/slugify";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUserAdminAccount", {
      type: "UserPayload",
      args: { input: nonNull("UserInput") },
      resolve: async (
        _,
        { input: { firstname, lastname, password, email } }
      ): Promise<any> => {
        if (!firstname || !lastname || !password || !email) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const checkUserEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (checkUserEmail) {
          return ERROR_ALREADY_EXIST;
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
    t.field("createUserRecreuiters", {
      type: "UserPayload",
      args: { input: nonNull("UserRecruiterInput") },
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
          return ERROR_ALREADY_EXIST;
        }
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
        fileUpload: nonNull("Upload"),
      },
      resolve: async (
        _,
        {
          input: { email, firstname, lastname, password },
          requirement: { type },
          fileUpload,
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
            return ERROR_ALREADY_EXIST;
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
        };
      },
    });
  },
});
