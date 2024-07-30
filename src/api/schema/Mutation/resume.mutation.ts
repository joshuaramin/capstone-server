import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";

export const ResumeMutation = extendType({
  type: "resume",
  definition(t) {
    t.field("createResume", {
      type: "ResumePayload",
      args: { profileID: nonNull(idArg()), file: "Upload" },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;

        if (!file) {
          return ERROR_MESSAGE_BAD_INPUT;
        }

        const resume = await prisma.resume.create({
          data: {
            resume: "",
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });

        return {
          __tyname: "resume",
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
