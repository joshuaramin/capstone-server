import { booleanArg, extendType, idArg, list, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import { add } from "date-fns";
import { ERROR_MESSAGE_BAD_INPUT } from "../../helpers/error";
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
            JobType,
            location,
            duration,
            experience,
          },
          salary: { min, max, currency, fixed },
          skills,
        }
      ): Promise<any> => {
        if (
          !title ||
          !description ||
          !JobType ||
          !location ||
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

        await prisma.activityLogs.create({
          data: {
            title: "Create Job Post",
            description: "You created a Job post",
            User: {
              connect: {
                userID: company.userID,
              },
            },
          },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const existingJobPost = await prisma.jobPost.findFirst({
          where: {
            Company: {
              companyID,
            },
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        if (company.User.plan === "BASIC") {
          if (existingJobPost) {
            return {
              __typename: "BADINPUT",
              code: 400,
              message: "A job post has already been created today.",
            };
          }

          if (fixed) {
            const job = await prisma.jobPost.create({
              data: {
                title,
                description,
                endDate: add(new Date(Date.now()), {
                  days: 21,
                }),
                location,
                duration,
                experience,
                featured: false,
                status: "Published",
                isOpen: "Open",
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

            return {
              __typename: "jobpost",
              ...job,
            };
          } else {
            const job = await prisma.jobPost.create({
              data: {
                title,
                description,
                endDate: add(new Date(Date.now()), {
                  days: 21,
                }),
                location,
                duration,
                experience,
                featured: false,
                status: "Published",
                isOpen: "Open",
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

            return {
              __typename: "jobpost",
              ...job,
            };
          }
        } else {
          if (fixed) {
            const job = await prisma.jobPost.create({
              data: {
                title,
                description,
                endDate: add(new Date(Date.now()), {
                  days: 90,
                }),
                location,
                duration,
                experience,
                status: "Published",
                isOpen: "Open",
                slug: Slugify(title),
                featured: true,
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

            return {
              __typename: "jobpost",
              ...job,
            };
          } else {
            const job = await prisma.jobPost.create({
              data: {
                title,
                description,
                endDate: add(new Date(Date.now()), {
                  days: 90,
                }),
                location,
                duration,
                experience,
                featured: true,
                status: "Published",
                isOpen: "Open",
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

            return {
              __typename: "jobpost",
              ...job,
            };
          }
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
            experience,
            location,
            status,
            isOpen,
          },
          salary: { min, max, currency, fixed },
          skills,
        }
      ): Promise<any> => {
        const jobpost = await prisma.jobPost.findUnique({
          where: {
            jobPostID,
          },
          include: {
            Company: {
              include: {
                User: true,
              },
            },
          },
        });

        if (fixed) {
          const fixedPrice = await prisma.jobPost.update({
            data: {
              title,
              description,
              JobType,
              duration,
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
          await prisma.activityLogs.create({
            data: {
              title: "Create Job Post",
              description: "You created a Job post",
              User: {
                connect: {
                  userID: jobpost.Company.User.userID,
                },
              },
            },
          });

          return {
            __typename: "jobpost",
            ...perHourJob,
          };
        }
      },
    });
    t.field("updateJobSettings", {
      type: "jobpost",
      args: {
        jobPostID: nonNull(idArg()),
        applicationStatus: stringArg(),
        status: stringArg(),
      },
      resolve: async (_, { jobPostID, applicationStatus, status }) => {
        if (applicationStatus === "Close") {
          const jobApplicants = await prisma.application.findMany({
            where: {
              jobPostID,
              NOT: {
                OR: [
                  {
                    status: "Hired",
                  },
                  {
                    status: "Rejected",
                  },
                ],
              },
            },
            include: {
              User: true,
            },
          });

          //send an email

          jobApplicants.map(({}) => {});
        }

        return await prisma.jobPost.update({
          where: {
            jobPostID,
          },
          data: {
            status: status,
            isOpen: applicationStatus,
          },
        });
      },
    });
    t.field("archiveJobPost", {
      type: "jobpost",
      args: { jobPostID: nonNull(idArg()), boolean: booleanArg() },
      resolve: async (_, { jobPostID, boolean }): Promise<any> => {
        if (boolean === true) {
          const jobpost = await prisma.jobPost.update({
            data: { isArchive: true },
            where: {
              jobPostID,
            },
            include: {
              Company: {
                include: {
                  User: true,
                },
              },
            },
          });
          await prisma.activityLogs.create({
            data: {
              title: "Archived Job Post",
              description: "You created archive a Job post",
              User: {
                connect: {
                  userID: jobpost.Company.User.userID,
                },
              },
            },
          });

          return {
            ...jobpost,
          };
        } else {
          const jobpost = await prisma.jobPost.update({
            data: { isArchive: false },
            where: {
              jobPostID,
            },
            include: {
              Company: {
                include: {
                  User: true,
                },
              },
            },
          });
          await prisma.activityLogs.create({
            data: {
              title: "UnArchive Job Post",
              description: "You unarchive a Job post",
              User: {
                connect: {
                  userID: jobpost.Company.User.userID,
                },
              },
            },
          });

          return {
            ...jobpost,
          };
        }
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
