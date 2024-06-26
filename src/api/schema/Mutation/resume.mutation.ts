import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const ResumeMutation = extendType({
  type: "resume",
  definition(t) {
    t.field("createResume", {
      type: "resume",
      args: { profileID: nonNull(idArg()), file: "Upload" },
      resolve: async (_, { profileID, file }): Promise<any> => {
        const { createReadStream, filename } = await file;
        return await prisma.resume.create({
          data: {
            resume: "",
            Profile: {
              connect: {
                profileID,
              },
            },
          },
        });
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
