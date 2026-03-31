const errorCodes = {
  invalid_type: "The field {field} is required",
  invalid_email: "The email is in an invalid_format",
  to_short: "The field {field} must be at least {minimum} characters long",
  to_long: "The field {field} may contain a maximum of 5 characters",
  to_small: "The field {field} cant be smaller then {minimum}",
  to_big: "The field {field} may cant be large then {maximum}",
  sign_up_request_expired:
    "The Link has expired. Please register your Account again",
  invalid_register_link:
    "The Link is invalid .Please register your Account again",
  invalid_password_link:
    "The Link is invalid .Please reset  your password again",
  email_or_password_wrong: "The E-Mail or the password is incorrect",
  unknown: "Something went wrong",
  password: "Passwort",
  email: "E-Mail",
  username: "Nutzername",
};

type ErrCodeKey = keyof typeof errorCodes;

export type { ErrCodeKey };

export default errorCodes;
