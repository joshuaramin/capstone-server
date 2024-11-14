import axios from "axios";
import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../helpers/server";

export const ZoomMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createZoomIntegration", {
      type: "zintegration",
      args: {
        userID: nonNull(idArg()),
        accountID: nonNull(stringArg()),
        clientID: nonNull(stringArg()),
        secretID: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { userID, accountID, clientID, secretID }
      ): Promise<any> => {
        return await prisma.zintegration.create({
          data: {
            accountID,
            clientID,
            secretID,
            userID,
          },
        });
      },
    });
    t.field("updateZoomIntegration", {
      type: "zintegration",
      args: {
        integrationID: nonNull(idArg()),
        accountID: nonNull(stringArg()),
        clientID: nonNull(stringArg()),
        secretID: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { integrationID, accountID, clientID, secretID }
      ): Promise<any> => {
        return await prisma.zintegration.update({
          data: {
            accountID,
            clientID,
            secretID,
          },
          where: { integrationID },
        });
      },
    });
    t.field("zoom_access", {
      type: "zoom",
      args: { userID: nonNull(idArg()) },
      resolve: async (_, { userID }, { req, res }): Promise<any> => {
        const zoom = await prisma.zintegration.findFirst({
          where: {
            userID,
          },
        });

        if (!zoom) {
          throw new Error("Invalid Access Token. Setup ur Zoom Account");
        }
        const { data } = await axios.post(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoom.accountID}`,
          null,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            auth: {
              username: `${zoom.clientID}`,
              password: `${zoom.secretID}`,
            },
          }
        );

        res.cookie("zoom_actkn", data.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        return {
          ...data,
        };
      },
    });
  },
});
