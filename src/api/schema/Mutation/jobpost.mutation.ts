import { booleanArg, extendType, idArg, inputObjectType, nonNull } from "nexus";
import { prisma } from "../../helpers/server";

export const JobPostInput = inputObjectType({
  name: "jobPostInput",
  definition(t) {
    t.string("title");
    t.string("description");
    t.list.string("keyword");
  },
});

export const JobPostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createJobPost", {
      type: "jobpost",
      args: { companyID: nonNull(idArg()), input: nonNull("jobPostInput") },
      resolve: async (
        _,
        { companyID, input: { title, description, keyword } }
      ): Promise<any> => {
        return await prisma.jobPost.create({
          data: {
            title,
            description,
            keyword,
            Company: {
              connect: {
                companyID,
              },
            },
          },
        });
      },
    });
    t.field("updateJobPost", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()), input: nonNull("jobPostInput") },
      resolve: async (_, { jobPostID, input }): Promise<any> => {
        return await prisma.jobPost.update({
          data: {
            ...input,
          },
          where: {
            jobPostID,
          },
        });
      },
    });
    t.field("updateJobPostDefault", {
      type: "jobpost",
      args: {
        jobPostID: nonNull(idArg()),
        defaultStatus: nonNull(booleanArg()),
      },
      resolve: async (_, { jobPostID, defaultStatus }): Promise<any> => {
        return await prisma.jobPost.update({
          where: { jobPostID },
          data: { default: defaultStatus },
        });
      },
    });
    t.field("deleteJobPost", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()) },
      resolve: async (_, { jobPostID }): Promise<any> => {
        return await prisma.jobPost.delete({
          where: { jobPostID },
        });
      },
    });
  },
});
