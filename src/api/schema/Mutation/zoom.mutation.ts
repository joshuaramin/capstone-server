import axios from "axios";
import { extendType, intArg, nonNull, stringArg } from "nexus";

export const ZoomMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("zoom_access", {
      type: "zoom",
      resolve: async (_, __, { req, res }): Promise<any> => {
        const { data } = await axios.post(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=p7qd2Ir8RamiUL3zxa-rKw`,
          null,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            auth: {
              username: process.env.ZOOM_USERNAME,
              password: process.env.ZOOM_PASSWWORD,
            },
          }
        );

        res.cookie("zoom_actkn", data.access_token, {
          httpOnly: true, // or false if it's needed on the client-side
          secure: true, // if using HTTPS
          sameSite: "none", // or 'Lax'/'None' based on your needs
        });

        return {
          ...data,
        };
      },
    });
  },
});
