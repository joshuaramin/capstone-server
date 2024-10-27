import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const CompanyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCompany", {
      type: "company",
      args: { companyID: nonNull(idArg()) },
      resolve: async (_, { companyID }): Promise<any> => {
        return await prisma.company.update({
          where: { companyID },
          data: {
            verified: true,
          },
        });
      },
    });
    t.field("companyUploadDocuments", {
      type: "requirement",
      args: { companyID: nonNull(idArg()), file: nonNull("Upload") },
      resolve: async (_, { companyID, file }) => {
        const { createReadStream, filename } = await file;

        return await prisma.requirements.create({
          data: {
            type: filename,
            requirement: await uploader(createReadStream()),
            Company: {
              connect: { companyID },
            },
          },
        });
    },
    });
    t.field("updateCompanyLogo", {
      type: "company",
      args: { companyID: nonNull(idArg()), file: nonNull("Upload") },
      resolve: async (_, { companyID, file }) => {
        const { createReadStream, filename } = await file;

        return await prisma.media.create({
          data: {
            media: await uploader(createReadStream()),
            Company: {
              connect: { companyID },
            },
          },
        });
      },
    });
  },
});
