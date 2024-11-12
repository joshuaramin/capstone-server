import {
  extendType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  stringArg,
} from "nexus";
import { prisma } from "../../helpers/server";

export const PortfolioMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPortfolio", {
      type: "PortfolioPayload",
      args: {
        profileID: nonNull(idArg()),
        input: nonNull("PortfolioInput"),
        skills: list(stringArg()),
      },

      resolve: async (_, { profileID, input, skills }): Promise<any> => {
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

        const user = await prisma.user.findFirst({
          where: { Profile: { profileID } },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Created Work Experience",
            description: "You added a work experience",
            User: {
              connect: {
                userID: user.userID,
              },
            },
          },
        });
        const portfolio = await prisma.portfolio.create({
          data: {
            companyName: input.companyName,
            description: input.description,
            employmentType: input.employmentType,
            startMonth: input.startMonth,
            startYear: input.startYear,
            endMonth: input.endMonth,
            endYear: input.endYear,
            location: input.location,
            locationType: input.locationType,
            title: input.title,
            Skills: {
              connect: skills.map((skilled) => {
                return { skills: skilled };
              }),
            },
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });

        return {
          __typename: "portfolio",
          ...portfolio,
        };
      },
    });
    t.field("updatePortfolio", {
      type: "portfolio",
      args: {
        portfolioID: nonNull(idArg()),
        input: nonNull("PortfolioInput"),
        skills: nonNull(list(stringArg())),
      },
      resolve: async (_, { portfolioID, input, skills }): Promise<any> => {
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

        const portfolio = await prisma.portfolio.update({
          data: {
            ...input,
            Skills: {
              connect: skills.map((skilled) => {
                return { skills: skilled };
              }),
            },
          },
          where: {
            portfolioID,
          },
        });

        const user = await prisma.user.findFirst({
          where: {
            Profile: {
              Portfolio: {
                some: { portfolioID },
              },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Updated Work Experience",
            description: "You updated your work experience",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return portfolio;
      },
    });
    t.field("deletePortfolio", {
      type: "portfolio",
      args: { portfolioID: nonNull(idArg()) },
      resolve: async (_, { portfolioID }): Promise<any> => {
        const portfolio = await prisma.portfolio.delete({
          where: { portfolioID },
          select: {
            portfolioID: true,
            title: true,
            Profile: {
              select: {
                userID: true,
              },
            },
          },
        });

        const user = await prisma.user.findUnique({
          where: {
            userID: portfolio.Profile.userID,
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Deleted Work Experience",
            description: "You removed your Work Experience",
            User: {
              connect: { userID: user.userID },
            },
          },
        });

        return portfolio;
      },
    });
  },
});
