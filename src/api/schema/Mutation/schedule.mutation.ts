import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";
import axios from "axios";
import { ApplicantInterview } from "../../helpers/sendgrid";

export const ScheduleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSchedule", {
      type: "SchedulePayload",
      args: {
        input: nonNull("ScheduleInput"),
        senderID: nonNull(stringArg()),
        receiverID: nonNull(stringArg()),
        actkn: nonNull(stringArg()),
        applicantID: nonNull(idArg()),
      },
      resolve: async (
        _,
        {
          input: {
            description,
            startDate,
            title,
            endDate,
            duration,
            endTime,
            startTime,
          },

          applicantID,
          receiverID,
          senderID,
          actkn,
        },
        { req, res }
      ): Promise<any> => {
        if (!startDate) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Start Date is required",
          };
        }

        if (!endDate) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "End Date is required",
          };
        }

        if (!title) {
          return {
            __typename: "ErrorObject",
            code: 400,
            message: "Title is required",
          };
        }

        const application = await prisma.application.findFirst({
          where: {
            applicationID: applicantID,
          },
          include: {
            JobPost: {
              include: {
                Company: true,
              },
            },
          },
        });

        const { data } = await axios.post(
          `https://zoom.us/v2/users/me/meetings`,
          {
            topic: title,
            type: 2,
            start_time: new Date(`${startDate}T${startTime}:00Z`),
            end_time: new Date(`${endDate}T${endTime}:00Z`),
            duration,
            timezone: "UTC",
            settings: {
              host_video: true,
              participant_video: true,
              join_before_host: false,
              mute_upon_entry: true,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${actkn}`,
            },
          }
        );

        const schedule = await prisma.schedule.create({
          data: {
            link: data.join_url,
            startDate,
            endDate,
            startTime,
            endTime,
            description,
            title,
            senderID,
            receiverID,
          },
          include: {
            receiver: {
              include: {
                Profile: true,
                Application: true,
              },
            },
          },
        });

        await prisma.notification.create({
          data: {
            title: "Created Interview Schedule",
            User: {
              connect: {
                userID: receiverID,
              },
            },
            Company: {
              connect: {
                companyID: application.JobPost.Company.companyID,
              },
            },
            Schedule: {
              connect: {
                scheduleID: schedule.scheduleID,
              },
            },
          },
        });

        ApplicantInterview(
          `${schedule.receiver.email}`,
          `${schedule.receiver.Profile.firstname} ${schedule.receiver.Profile.lastname}`,
          `${application.JobPost.title}`,
          `${application.JobPost.Company.companyName}`,
          `${startDate}`,
          `${startTime}`,
          `${schedule.link}`
        );
        await prisma.activityLogs.create({
          data: {
            title: "Create Calendar Schedule",
            description: "You have created a calendar schedule for interview",
            User: {
              connect: {
                userID: senderID,
              },
            },
          },
        });

        return {
          __typename: "schedule",
          ...schedule,
        };
      },
    });
    t.field("updateSchedule", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()), input: nonNull("ScheduleInput") },
      resolve: async (_, { scheduleID, input }): Promise<any> => {
        const user = await prisma.schedule.findFirst({
          where: {
            scheduleID,
          },
          include: {
            sender: {
              include: {
                Company: true,
              },
            },
          },
        });
        await prisma.notification.create({
          data: {
            title: "Reschedule Interview Schedule",
            User: {
              connect: {
                userID: user.receiverID,
              },
            },
            Company: {
              connect: {
                companyID: user.sender.Company.companyID,
              },
            },
            Schedule: {
              connect: {
                scheduleID,
              },
            },
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Update Calendar Schedule",
            description: "You have updated a calendar schedule for interview",
            User: {
              connect: {
                userID: user.senderID,
              },
            },
          },
        });

        return await prisma.schedule.update({
          data: {
            ...input,
          },
          where: {
            scheduleID,
          },
        });
      },
    });
    t.field("deleteSchedule", {
      type: "schedule",
      args: { scheduleID: nonNull(idArg()) },
      resolve: async (_, { scheduleID }): Promise<any> => {
        return await prisma.schedule.delete({
          where: { scheduleID },
        });
      },
    });
  },
});
