import { objectType } from "nexus";

export const zoomObject = objectType({
  name: "zoom",
  definition(t) {
    t.string("access_token");
    t.string("token_type");
    t.int("expires_in");
    t.string("scope");
    t.string("api_url");
  },
});

export const ZoomMeeting = objectType({
  name: "zoom_meeting",
  definition(t) {
    t.string("uuid");
    t.int("id");
    t.string("host_id");
    t.string("topic");
    t.string("type");
    t.string("status");
    t.string("start_time");
    t.int("duration");
    t.string("timezone");
    t.string("created_at");
    t.string("start_url");
    t.string("join_url");
    t.string("password");
    t.string("h323_password");
    t.string("pstn_password");
    t.string("encrypted_password");
  },
});

export const zintegration = objectType({
  name: "zintegration",
  definition(t) {
    t.id("integrationID");
    t.string("accountID");
    t.string("clientID");
    t.string("secretID");
  },
});
