import {
  GraphQLDateTime,
  GraphQLDate,
  GraphQLEmailAddress,
  GraphQLPhoneNumber,
  GraphQLJSON,
} from "graphql-scalars";
import { asNexusMethod } from "nexus";
import { GraphQLUpload } from "graphql-upload-ts";

export const DatetimeGQL = asNexusMethod(GraphQLDateTime, "datetime");
export const DateGQL = asNexusMethod(GraphQLDate, "date");
export const EmailGQL = asNexusMethod(GraphQLEmailAddress, "email");
export const PhoneGQL = asNexusMethod(GraphQLPhoneNumber, "phone");
export const UploadGQL = asNexusMethod(GraphQLUpload, "Upload");
export const JSONGQl = asNexusMethod(GraphQLJSON, "json");
