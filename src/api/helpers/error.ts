export const ERROR_MESSAGE_BAD_INPUT = {
  __typename: "BADINPUT",
  code: 400,
  message: "Field should not be empty!",
};

export const ERROR_MESSAGE_FORBIDDEN = {
  __typename: "Forbidden",
  code: 403,
  message: "You do not have permission to access this resource.",
};

export const ERROR_MESSAGE_CREDENTIALS = {
  __typename: "CredentialsInvalid",
  code: 401,
  message: "Access is denied due to invalid credentials.",
};

export const ERROR_NOT_FOUND = {
  __typename: "NOTFOUND",
  code: 404,
  message: "Not Found",
};

export const EMAIL_ADDRESS_NOT_FOUND = {
  __typename: "NOTFOUND",
  code: 404,
  message: "Email address not found.",
};

export const ERROR_ALREADY_EXIST = {
  __typename: "PasswordAlreadyExist",
  code: 409,
  message: "Email Address is Already Exist.",
};

export const ERROR_PASSWORD_ALREADY_EXIST = {
  __typename: "AlreadyExist",
  code: 400,
  message: "New password cannot be the same as the previous password.",
};

export const ERROR_EXPIRED = {
  __typename: "Expired",
  code: 410,
  message:
    "The resource you are looking for has been permanently removed. Please check the URL for any spelling mistakes or contact the site administrator if you believe this is an error.",
};

export const PAYMENT_REQUIRED = {
  __typename: "Payment",
  code: 402,
  message:
    "You don't have any posts remaining. Please upgrade your plan to the Pro version.",
};
