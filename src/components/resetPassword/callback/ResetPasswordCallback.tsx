import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Zod, { ZodError } from "zod";
import errorCodes from "../../../constants/errorCodes";
import useRequest, { ApiErrors } from "../../../hooks/useRequest";
import { translateZodError } from "../../../utils/errors";
import BaseInput from "../../base/BaseInput";

function createValdiator() {
  const passwordParser = Zod.string().min(5, "to_short").max(30, "to_long");
  return {
    password: (password: string | undefined) => {
      try {
        passwordParser.parse(password);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("password", error);
      }
    },
  };
}

function getGlobalErrMessage(errors: FieldErrors<{ password: string }>) {
  if (!errors["root"]) return undefined;
  const globalErr = errors["root"]?.message;
  if (!globalErr) return undefined;
  if (typeof globalErr !== "object") return globalErr;
  const m = (globalErr as { message?: string })?.message || undefined;
  return m;
}

type ResetPasswordData = { password: string };

export default function ResetPasswordCallback() {
  const [id, setId] = useState<null | false | string>(null);
  const [hasResetted, setHasResetted] = useState(false);
  const methods = useForm<ResetPasswordData>();
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  const [{ isLoading }, onApiRequest] = useRequest((errors: ApiErrors) => {
    Object.keys(errors).forEach((key) => {
      if (key === "password") {
        setError("password", { message: errors["email"], type: "manual" });
      } else {
        setError(`root.${key}`, {
          type: "manual",
          message: errors[key],
        });
      }
    });
  });

  const { t: translate } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    setId(id || false);
  }, []);

  const validator = createValdiator();

  if (id === null) return null;
  async function onReset({ password }: { password: string }) {
    try {
      await onApiRequest(`users/resetPassword/callback`, {
        method: "POST",
        body: {
          password,
          id,
        },
      });
      setHasResetted(true);
    } catch (e) {
      console.error("error in resetPassword.callback", e);
    }
  }

  const globalErr = getGlobalErrMessage(errors);
  if (globalErr || id === false) {
    const errMessage =
      globalErr || translate(errorCodes["invalid_password_link"]);
    return (
      <Stack>
        <Text>{errMessage}</Text>
        <Button onClick={() => navigate("/resetPasword")}>
          Zum Password zurucksetzen{" "}
        </Button>
      </Stack>
    );
  }
  if (hasResetted) {
    return (
      <Stack>
        <Text>Dein Password wurde zuruckgesetzt</Text>
        <Button onClick={() => navigate("/login")}>zum einloggen </Button>
      </Stack>
    );
  }
  if (isLoading)
    return (
      <Stack>
        <Spinner />
      </Stack>
    );
  return (
    <Stack w="100vh" h="100vh" justifyContent={"center"} alignItems={"center"}>
      <FormProvider {...methods}>
        <Text> Neues Password auswaehlen</Text>
        <BaseInput<ResetPasswordData>
          w={"300px"}
          validate={validator.password}
          name="password"
          placeholder="password"
        />
        <Button
          w={"300px"}
          onClick={handleSubmit(onReset)}
          disabled={isLoading}
          loading={isLoading}
        >
          Jetzt Password zurucksetzen
        </Button>
      </FormProvider>
    </Stack>
  );
}
