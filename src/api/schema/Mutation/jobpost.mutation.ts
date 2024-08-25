import { booleanArg, extendType, idArg, list, nonNull, stringArg } from "nexus";
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
        skills: nonNull(list(stringArg())),
      },
      resolve: async (
        _,
        {
          companyID,
          input: {
            title,
            description,
            endDate,
            JobType,
            location,
            duration,
            experience,
            status,
            isOpen,
          },
          salary: { min, max, currency, fixed },
          skills,
        }
      ): Promise<any> => {
        if (
          !title ||
          !description ||
          !endDate ||
          !JobType ||
          !location ||
          !status ||
          !duration ||
          !currency
        ) {
          return ERROR_MESSAGE_BAD_INPUT;
        }
        const company = await prisma.company.findUnique({
          where: {
            companyID,
          },
          include: {
            User: true,
            JobPost: true,
          },
        });

        if (company.User.plan === "Basic" && company.JobPost.length === 5) {
          return {
            __typename: "Payment",
            code: "402",
            message:
              "You don't have any posts remaining. Please upgrade your plan to the Pro version.",
          };
        }

        if (fixed) {
          const job = await prisma.jobPost.create({
            data: {
              title,
              description,
              endDate,
              location,
              duration,
              experience,
              status,
              isOpen,
              slug: Slugify(title),
              Salary: {
                create: {
                  fixed,
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
                connect: skills.map((skill) => {
                  return { skills: skill };
                }) as any,
              },
            },
          });

          pubsub.publish("createJobPostToMyCompany", job);

          return {
            __typename: "jobpost",
            ...job,
          };
        } else {
          const job = await prisma.jobPost.create({
            data: {
              title,
              description,
              endDate,
              location,
              duration,
              experience,
              isOpen,
              status,
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
                connect: skills.map((skill) => {
                  return { skills: skill };
                }) as any,
              },
            },
          });

          pubsub.publish("createJobPostToMyCompany", job);

          return {
            __typename: "jobpost",
            ...job,
          };
        }
      },
    });
    t.field("updateJobPost", {
      type: "jobpost",
      args: {
        jobPostID: nonNull(idArg()),
        input: "jobPostInput",
        salary: "salaryInput",
        skills: nonNull(list(stringArg())),
      },
      resolve: async (
        _,
        {
          jobPostID,
          input: {
            title,
            description,
            JobType,
            duration,
            endDate,
            experience,
            location,
            status,
            isOpen,
          },
          salary: { min, max, currency, fixed },
          skills,
        }
      ): Promise<any> => {
        if (fixed) {
          const fixedPrice = await prisma.jobPost.update({
            data: {
              title,
              description,
              JobType,
              duration,
              endDate,
              experience,
              location,
              isOpen,
              slug: Slugify(title),
              status,
              Salary: {
                update: {
                  fixed,
                  currency,
                },
              },
              Skills: {
                connect: skills.map((skilled) => {
                  return { skills: skilled };
                }),
              },
            },
            where: {
              jobPostID,
            },
          });

          return {
            __typename: "jobpost",
            ...fixedPrice,
          };
        } else {
          const perHourJob = await prisma.jobPost.update({
            data: {
              title,
              description,
              JobType,
              duration,
              endDate,
              experience,
              location,
              slug: Slugify(title),
              isOpen,
              status,
              Salary: {
                update: {
                  min,
                  max,
                  currency,
                },
              },
              Skills: {
                connect: skills.map((skilled) => {
                  return { skills: skilled };
                }),
              },
            },
            where: {
              jobPostID,
            },
          });

          return {
            __typename: "jobpost",
            ...perHourJob,
          };
        }
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
