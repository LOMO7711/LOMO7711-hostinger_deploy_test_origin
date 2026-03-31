import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateErrMessage } from "../utils/errors";
import request from "../utils/request";

type Errors = { message: string } & { [key: string]: string };

type RequestParams = {
  method?: "POST" | "PATCH" | "PUT" | "DELETE" | "GET";
  body?: { [key: string]: any } | FormData;
};

const bodyEnabledOptions = ["POST", "PATCH", "PUT"] as const;

function createRequestOpts(data: RequestParams) {
  const headers = new Headers();
  const opts: RequestInit = {
    credentials: "include",
    method: data.method,
  };
  const method = data.method || "GET";
  const isBodyAllowed = bodyEnabledOptions.some((e) => e === method);
  if (data.body && !isBodyAllowed) {
    const message = `${method} is not allowed with body`;
    throw new Error(message);
  }
  if (data.body) {
    if (typeof data.body === "object") {
      const jsonBody = JSON.stringify(data.body);
      const contentLength = jsonBody.length;
      headers.append("Content-Type", "application/json");
      headers.append("Content-Length", contentLength.toString());
      opts.body = jsonBody;
    } else {
      headers.append("Content-Type", "multipart/formdata");
      opts.body = data.body;
    }
  }
  opts.headers = headers;
  return opts;
}

type ResponseInfo = {
  status: number;
  data: { [key: string]: any } | ResponseErrors;
};

type ResponseErrors = {
  message?: string;
  errors: {
    [key: string]: { code: string; info: { [key: string]: string } };
  };
};

export type { Errors as ApiErrors };

export default function useRequest<T>(setErrors?: (errors: Errors) => any) {
  const { t: translate } = useTranslation();
  type RequestState = T & { isLoading: boolean };
  const [state, setState] = useState<RequestState>({
    isLoading: false,
  } as RequestState);
  const onRequest = useCallback(
    async (
      url: string,
      params: RequestParams = {} as RequestParams,
      options: T = {} as T
    ) => {
      setState({ isLoading: true, ...options });
      const t = new Promise((resolve) => setTimeout(resolve, 200));

      try {
        const opts = createRequestOpts(params);
        const res = await request(url, opts);
        const contentLength = res.headers.get("Content-Length");
        let data: { [key: string]: any } = {};
        const hasResponseBody =
          contentLength && contentLength.length && parseInt(contentLength) > 0;
        if (hasResponseBody) {
          data = await res.json();
        }
        const result = { status: res.status, data };
        await t;
        if (!res.ok) throw result;
        if (result.data.errors && Object.keys(result.data.errors).length) {
          const settedErrors: { [key: string]: string } = {};
          for (const key of result.data.errors) {
            const value = result.data.errors[key];
            if (!value?.code) continue;
            settedErrors[key] = translateErrMessage(key, value, translate);
            typeof setErrors === "function" &&
              setErrors(settedErrors as Errors);
          }
        }

        return result;
      } catch (e) {
        const err = e as unknown as
          | ResponseInfo
          | { data?: ResponseInfo["data"] };
        const message = `error in useRequest.${url}`;
        console.error(message, e);
        const data = err?.data || {};
        const settedErrors: { [key: string]: string } = {};
        if (data["errors"] && typeof data["errors"] === "object") {
          for (const key of Object.keys(data["errors"])) {
            const value = data["errors"][key];
            if (!value?.code) continue;
            settedErrors[key] = translateErrMessage(key, value, translate);
          }
        } else {
          settedErrors["message"] = "something_went_wrong";
        }

        await t;
        typeof setErrors === "function" && setErrors(settedErrors as Errors);
        throw e;
      } finally {
        setState({ isLoading: false } as RequestState);
      }
    },
    [translate, setErrors]
  );

  return [state, onRequest] as const;
}
