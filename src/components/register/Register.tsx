import {
  Box,
  HStack,
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Zod, { ZodError } from "zod";
import apple from "../../assets/icons/apple.svg";
import google from "../../assets/icons/google.png";
import useRequest, { ApiErrors } from "../../hooks/useRequest";
import { translateZodError } from "../../utils/errors";
import { BaseButton } from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { DividerWithText } from "../base/DividerWithText";
import { BasePasswordInput } from "../base/PasswordInput";
import { OAuth2LoginButton } from "../login/OAuth2LoginButton";
import { toaster } from "../ui/toaster";
import { useNavigate } from "react-router";
import { RegistrationHeader } from "./RegistrationHeader";

type RegisterData = {
  email: string;
  password: string;
  name: string;
};
function getGlobalErrMessage(errors: FieldErrors<RegisterData>) {
  if (!errors["root"]) return undefined;
  const globalErr = errors["root"]?.message;
  if (!globalErr) return undefined;
  if (typeof globalErr !== "object") return globalErr;
  const m = (globalErr as { message?: string })?.message || undefined;
  return m;
}

function createValdiator() {
  const mailParser = Zod.string().email("invalid_email");
  const nameParser = Zod.string().min(3, "to_short").max(50, "to_long");
  const passwordParser = Zod.string().min(5, "to_short").max(30, "to_long");
  return {
    email: (email: string | undefined) => {
      try {
        mailParser.parse(email);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("email", error);
      }
    },
    name: (name: string | undefined) => {
      try {
        nameParser.parse(name);
        return true;
      } catch (e) {
        const error = e as ZodError;
        console.error("errlr", error, translateZodError("name", error));
        return translateZodError("name", error);
      }
    },
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

const fields = ["email", "password", "name"] as const;
export default function Register() {
  const methods = useForm<RegisterData>({ defaultValues: {} });
  const {
    handleSubmit,
    formState: { errors, isDirty },
    setError,
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

  const { t } = useTranslation();
  const navigate = useNavigate();

  async function onRegister(data: RegisterData) {
    try {
      await onApiRequest(
        "users/register",
        { method: "POST", body: data },
        { provider: "email" }
      );
      toaster.create({
        title: "Registration successful",
        description: "We have sent you an email to verify your account.",
        type: "success",
      });
      navigate("/login");
    } catch (e) {
      console.error("error in register", e);
    }
  }
  async function onRegisterGoogle() {
    try {
      const res = await onApiRequest(
        "users/register/google",
        { method: "POST" },
        { provider: "google" }
      );

      const { link } = res.data as { link: string };
      window.location.href = link;
    } catch (e) {
      console.error("error in register", e);
    }
  }

  const validator = createValdiator();
  const globalErrMessage = getGlobalErrMessage(errors);

  return (
    <FormProvider {...methods}>
      <VStack h={"100vh"} gap={"32px"}>
        <Spacer />
        <RegistrationHeader />
        <Stack gap={"24px"}>
          <HStack width={"100%"}>
            <OAuth2LoginButton
              icon={google}
              onLogin={onRegisterGoogle}
              disabled={isLoading}
              loading={isLoading && provider === "google"}
              text="Register with Google"
            />
            <OAuth2LoginButton
              icon={apple}
              onLogin={() => window.alert("Apple is not implemented yet!")}
              disabled={isLoading}
              loading={isLoading && provider === "apple"}
              text="Register with Apple"
            />
          </HStack>
          <DividerWithText text={"or register with E-Mail"} />
          <Stack>
            <BaseInput<RegisterData>
              width="500px"
              name="email"
              placeholder="E-Mail"
              validate={validator["email"]}
              showErrMessage={true}
            />
            <BaseInput<RegisterData>
              width="500px"
              name="name"
              placeholder="Name"
              validate={validator["name"]}
              showErrMessage={true}
            />
            <BasePasswordInput />
            <Box w="100%" height={"20px"}>
              {globalErrMessage && <Text color="red">{globalErrMessage}</Text>}
            </Box>
          </Stack>
          <Stack>
            <BaseButton
              isLoading={isLoading && provider === "email"}
              disabled={isLoading || !isDirty}
              onClick={handleSubmit(onRegister)}
            >
              register now
            </BaseButton>
            <HStack width={"100%"} justifyContent={"space-between"}>
              <Link href="/login">{t("Already have an account?")}</Link>
              <Link href="/login">{t("login now!")}</Link>
            </HStack>
          </Stack>
        </Stack>
        <Spacer />
      </VStack>
    </FormProvider>
  );
}
