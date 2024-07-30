import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const PortfolioInput = inputObjectType({
  name: "PortfolioInput",
  definition(t) {
    t.string("companyName");
    t.string("description");
    t.string("employmentType");
    t.date("startDate");
    t.string("location");
    t.string("locationType");
    t.date("endDate");
    t.string("title");
  },
});

export const PortfolioMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPortoflio", {
      type: "PortfolioPayload",
      args: {
        profileID: nonNull(idArg()),
        input: nonNull("PortfolioInput"),
        file: "Upload",
      },

      resolve: async (
        _,
        {
          profileID,
          input: {
            companyName,
            description,
            employmentType,
            endDate,
            location,
            locationType,
            startDate,
            title,
          },
          file,
        }
      ): Promise<any> => {
        const { createReadStream, filename } = await file;

        if (
          !companyName ||
          !description ||
          !employmentType ||
          !endDate ||
          !location ||
          !locationType ||
          !startDate ||
          !title
        ) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const portfolio = await prisma.portfolio.create({
          data: {
            companyName,
            description,
            employmentType,
            endDate,
            location,
            locationType,
            startDate,
            title,
            Media: {
              create: {
                media: "",
              },
            },
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });

        return {
          _typename: "portfolio",
          ...portfolio,
        };
      },
    });
    t.field("updatePorfolio", {
      type: "portfolio",
      args: { portfolioID: nonNull(idArg()), input: nonNull("PortfolioInput") },
      resolve: async (_, { portfolioID, input }): Promise<any> => {
        if (!input) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        return await prisma.portfolio.update({
          data: {
            ...input,
          },
          where: {
            portfolioID,
          },
        });
      },
    });
    t.field("deletePortoflio", {
      type: "portfolio",
      args: { portfolioID: nonNull(idArg()) },
      resolve: async (_, { portfolioID }): Promise<any> => {
        return await prisma.portfolio.delete({
          where: { portfolioID },
        });
      },
    });
  },
});
