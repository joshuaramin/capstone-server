import axios from "axios";
import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const PaypalSubscription = extendType({
  type: "Mutation",
  definition(t) {
    t.field("cancelSubscription", {
      type: "PaypalObject",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }) => {
        const userSubscription = await prisma.subscription.findFirst({
          where: {
            userID,
          },
        });

        axios.post(
          `https://api-m.paypal.com/v1/billing/subscriptions/${userSubscription.subscriptionId}/cancel`,
          {
            body: {
              reason: "Customer request cancellation",
            },
          },
          {
            headers: {
              Authorization: `Basic ${process.env.PAYPAL_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        await prisma.activityLogs.create({
          data: {
            title: "Cancel Subscription",
            description: "You cancelled your subscription.",
            User: {
              connect: { userID },
            },
          },
        });

        await prisma.subscription.delete({
          where: {
            subscriptionID: userSubscription.subscriptionID,
          },
        });

        await prisma.user.update({
          where: {
            userID,
          },
          data: {
            plan: "BASIC",
          },
        });

        await prisma.activityLogs.create({
          data: {
            title: "Upgrade Subscription",
            description: "You upgraded your subscription",
            User: {
              connect: {
                userID,
              },
            },
          },
        });

        return {
          reason: "Customer request cancellation",
        };
      },
    });
    t.field("upgradeSubscription", {
      type: "user",
      args: { userID: nonNull(idArg()), subscriptionId: nonNull(stringArg()) },
      resolve: async (_, { userID, subscriptionId }) => {
        await prisma.subscription.create({
          data: {
            subscriptionId,
          },
        });

        return await prisma.user.update({
          where: {
            userID,
          },
          data: {
            plan: "PRO",
          },
        });
      },
    });
  },
});
