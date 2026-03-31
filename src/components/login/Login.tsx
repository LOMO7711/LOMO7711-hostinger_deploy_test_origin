import { Center, HStack, Link, Spacer, Stack } from "@chakra-ui/react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import apple from "../../assets/icons/apple.svg";
import google from "../../assets/icons/google.png";
import useRequest, { ApiErrors } from "../../hooks/useRequest";
import { createMailAndPasswordValdiator } from "../../utils/createValidator";
import { BaseButton } from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { DividerWithText } from "../base/DividerWithText";
import { ErrorMessage } from "../base/ErrorMessage";
import { AuthHeaderSection } from "../register/AuthHeaderSection";
import { PasswordInput } from "../ui/password-input";
import { OAuth2LoginButton } from "./OAuth2LoginButton";

type LoginData = {
  email: string;
  password: string;
};

function getGlobalErrMessage(errors: FieldErrors<LoginData>) {
  if (!errors["root"]) return undefined;
  const globalErr = errors["root"]?.message;
  if (!globalErr) return undefined;
  if (typeof globalErr !== "object") return globalErr;
  const m = (globalErr as { message?: string })?.message || undefined;
  return m;
}

const fields = ["email", "password"] as const;

export default function Login() {
  const { t } = useTranslation();
  const methods = useForm<LoginData>({
    defaultValues: {},
  });
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = methods;
  const [{ isLoading, provider }, onApiRequest] = useRequest<{
    provider: "google" | "email" | "apple";
  }>((errors: ApiErrors) => {
    Object.keys(errors).forEach((key) => {
      if (fields.some((f) => f === key)) {
        setError(key as (typeof fields)[number], {
          message: errors[key],
          type: "manual",
        });
      } else {
        setError(`root.${key}`, {
          type: "manual",
          message: errors[key],
        });
      }
    });
  });
  const navigate = useNavigate();

  async function onLoginGoogle() {
    try {
      const res = await onApiRequest(
        "users/login/google",
        { method: "POST" },
        { provider: "google" }
      );

      const { link } = res.data as { link: string };
      window.location.href = link;
    } catch (e) {
      console.error("error in loginGoogle", e);
    }
  }

  async function onLogin(data: LoginData) {
    try {
      await onApiRequest(
        "session/create",
        { method: "POST", body: data },
        { provider: "email" }
      );
      navigate("/");
    } catch (e) {
      console.error("error in login", e);
    }
  }

  const mailAndPasswordValidator = createMailAndPasswordValdiator();
  const globalErrMessage = getGlobalErrMessage(errors);

  return (
    <FormProvider {...methods}>
      <Stack gap={"32px"} height={"100vh"}>
        <Spacer />
        <AuthHeaderSection
          title={"Login"}
          description={"Melde dich an und beginne deine Projekte zu verwalten"}
        />
        <Center>
          <Stack width={"500px"} gap={"24px"}>
            <HStack width={"100%"}>
              <OAuth2LoginButton
                icon={google}
                onLogin={onLoginGoogle}
                disabled={isLoading}
                loading={isLoading && provider === "google"}
                text="Log in with Google"
              />
              <OAuth2LoginButton
                icon={apple}
                onLogin={() => window.alert("Apple is not implemented yet!")}
                disabled={isLoading}
                loading={isLoading && provider === "apple"}
                text="Log in with Apple"
              />
            </HStack>
            <DividerWithText text={"or login with E-Mail"} />

            <Stack>
              <BaseInput<LoginData>
                name="email"
                placeholder="E-Mail"
                required={t("The field {field} is required").replace(
                  "{field}",
                  "E-Mail"
                )}
                validate={mailAndPasswordValidator["email"]}
                showErrMessage={true}
              />
              <PasswordInput
                {...register("password", {
                  ...mailAndPasswordValidator["password"],
                  required: "This field is required",
                })}
              />
              {globalErrMessage && <ErrorMessage error={globalErrMessage} />}
            </Stack>
            <Stack>
              <BaseButton
                loading={isLoading && provider === "email"}
                disabled={isLoading}
                onClick={handleSubmit(onLogin)}
              >
                login now
              </BaseButton>
              <HStack width={"100%"} justifyContent={"space-between"}>
                <Link href="/resetPassword">{t("Forgot your password?")}</Link>
                <Link href="/register">{t("Register here for free")}</Link>
              </HStack>
            </Stack>
          </Stack>
        </Center>
        <Spacer />
      </Stack>
    </FormProvider>
  );
}
