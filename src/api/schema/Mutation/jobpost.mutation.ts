import { booleanArg, extendType, idArg, list, nonNull } from "nexus";
import { prisma, pubsub } from "../../helpers/server";
import {
  ERROR_MESSAGE_BAD_INPUT,
  ERROR_MESSAGE_FORBIDDEN,
} from "../../helpers/error";
import { Slugify } from "../../helpers/slugify";

export const JobPostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createJobPost", {
      type: "JobPostPayload",
      args: {
        companyID: nonNull(idArg()),
        input: nonNull("jobPostInput"),
        salary: nonNull("salaryInput"),
        skillsID: nonNull(list(idArg())),
      },
      resolve: async (
        _,
        {
          companyID,
          input: { title, description, endDate, JobType, location, duration, experience },
          salary: { min, max, currency },
          skillsID,
        }
      ): Promise<any> => {
        if (
          !title ||
          !description ||
          !endDate ||
          !JobType ||
          !location ||
          !duration ||
          !min ||
          !max ||
          !currency
        ) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const company = await prisma.company.findUnique({
          where: {
            companyID,
          },
        });

        if (company.verified === false) {
          return ERROR_MESSAGE_FORBIDDEN;
        }
        const job = await prisma.jobPost.create({
          data: {
            title,
            description,
            endDate,
            location,
            duration,
            experience,
            isOpen: false,
            slug: Slugify(title),
            Salary: {
              create: {
                min,
                max,
                currency,
              },
            },
            JobType,
            Company: {
              connect: {
                companyID,
              },
            },
            Skills: {
              connect: skillsID.map((skillsID) => {
                return {
                  skillsID,
                };
              }),
            },
          },
        });

        pubsub.publish("createJob", job);

        return {
          __typename: "jobpost",
          ...job,
        };
      },
    });
    t.field("updateJobPost", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()), input: nonNull("jobPostInput") },
      resolve: async (_, { jobPostID, input }): Promise<any> => {
        if (!input) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const job = await prisma.jobPost.update({
          data: {
            ...input,
          },
          where: {
            jobPostID,
          },
        });

        return {
          __typename: "jobpost",
          ...job,
        };
      },
    });
    t.field("updateJobPostDefault", {
      type: "jobpost",
      args: {
        jobPostID: nonNull(idArg()),
        isDraft: nonNull(booleanArg()),
      },
      resolve: async (_, { jobPostID, isDraft }): Promise<any> => {
        return await prisma.jobPost.update({
          where: { jobPostID },
          data: { isDraft },
        });
      },
    });
    t.field("archiveJobPost", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()) },
      resolve: async (_, { jobPostID }): Promise<any> => {
        return await prisma.jobPost.update({
          data: { isArchive: true },
          where: {
            jobPostID,
          },
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
    t.list.field("generateJobPostApplicant", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()) },
      resolve: async (_, { jobPostID }): Promise<any> => {
        return await prisma.jobPost.findMany({
          where: { jobPostID },
        });
      },
    });
  },
});
