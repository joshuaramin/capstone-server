import { extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

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
      type: "portfolio",
      args: {
        profileID: nonNull(idArg()),
        input: nonNull("PortfolioInput"),
        file: "Upload",
      },

      resolve: async (_, { profileID, input: { companyName, description, employmentType, endDate, location, locationType, startDate, title}, file }): Promise<any> => {
        const { createReadStream, filename } = await file;
        return await prisma.portfolio.create({
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
      },
    });
    t.field("updatePorfolio", {
      type: "portfolio",
      args: { portfolioID: nonNull(idArg()), input: nonNull("PortfolioInput") },
      resolve: async (_, { portfolioID, input }): Promise<any> => {
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