import Zod, { ZodError } from "zod";
import i18n from "../i18n";
import { translateZodError } from "./errors";

export function createMailAndPasswordValdiator() {
  const mailParser = Zod.string().email("invalid_email");
  const passwordParser = Zod.string().min(5, "to_short").max(30, "to_long");
  return {
    email: (email: string | undefined) => {
      try {
        mailParser.parse(email);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("email", error, i18n.t);
      }
    },

    password: (password: string | undefined) => {
      try {
        passwordParser.parse(password);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("password", error, i18n.t);
      }
    },
  };
}
