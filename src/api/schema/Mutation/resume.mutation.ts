import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { uploader } from "../../helpers/cloudinary";

export const ResumeMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createResume", {
      type: "ResumePayload",
      args: { profileID: nonNull(idArg()), file: "Upload" },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;

        if (!file) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "File Upload is required",
          };
        }

        const resume = await prisma.resume.create({
          data: {
            title: filename,
            resume: await uploader(createReadStream()),
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });

        return {
          __typename: "resume",
          ...resume,
        };
      },
    });
    t.field("deleteResume", {
      type: "resume",
      args: { resumeID: nonNull(idArg()) },
      resolve: async (_, { resumeID }): Promise<any> => {
        return await prisma.resume.delete({
          where: { resumeID },
        });
      },
    });
  },
});
