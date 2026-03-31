import { ZodError, ZodIssue } from "zod";
import errorCodes, { ErrCodeKey } from "../constants/errorCodes";
import i18n from "../i18n";

type ErrorInfos = {
  code: string;
  info: { [key: string]: string };
};

function translateZodError(key: string, zodErr: ZodError) {
  const { issues } = zodErr;
  const issue = issues[0] as ZodIssue & { maximum?: number; minimum?: number };
  const { maximum, minimum, message } = issue;
  const info: ErrorInfos["info"] = {};
  if (typeof maximum === "number") info["maximum"] = maximum.toString();
  if (typeof minimum === "number") info["minimum"] = minimum.toString();
  return translateErrMessage(key, { code: message, info });
}

function translateErrMessage(name: string, err: ErrorInfos): string {
  if (!(err.code in errorCodes)) {
    return err.code;
  }
  const code = err.code as ErrCodeKey;
  let text = i18n.t(errorCodes[code]);
  text = text.replace("{field}", i18n.t(name));
  if (err.info) {
    const info = err.info as ErrorInfos["info"];
    for (const key of Object.keys(info) as [keyof ErrorInfos["info"]]) {
      const value = info[key];
      if (!value) continue;
      text = text.replace(`{${key}}`, value.toString());
    }
  }

  return text;
}
export { translateErrMessage, translateZodError };
export type { ErrorInfos };
