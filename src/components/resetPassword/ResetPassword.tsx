import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Zod, { ZodError } from "zod";
import useRequest, { ApiErrors } from "../../hooks/useRequest";
import { translateZodError } from "../../utils/errors";
import { BaseButton } from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { BaseText } from "../base/BaseText";
import { AuthHeaderSection } from "../register/AuthHeaderSection";

function createValdiator() {
  const mailParser = Zod.string().email("invalid_email");
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
  };
}

type ResetPaswordData = { email: string };

export default function ResetPassword() {
  const methods = useForm<ResetPaswordData>({ defaultValues: {} });
  const { handleSubmit, setError } = methods;
  const navigate = useNavigate();
  const validator = createValdiator();

  const [{ isLoading }, onApiRequest] = useRequest((errors: ApiErrors) => {
    Object.keys(errors).forEach((key) => {
      if (key === "email") {
        setError("email", { message: errors["email"], type: "manual" });
      } else {
        setError(`root.${key}`, {
          type: "manual",
          message: errors[key],
        });
      }
    });
  });
  const [email, setEmail] = useState<string | null>(null);

  async function onSubmit(data: { email: string }) {
    try {
      await onApiRequest("users/resetPassword", {
        method: "POST",
        body: data,
      });
      setEmail(data.email);
    } catch (e) {
      console.error("error in resetPassword", e);
    }
  }

  return (
    <Stack justifyContent={"center"} alignItems={"center"} w="100vw" h="100vh">
      <AuthHeaderSection
        title="Reset your password"
        description="Reset your password to access your account"
      />
      <FormProvider {...methods}>
        {email ? (
          <>
            <BaseText>
              If an account with the email address exists, a confirmation email
              to reset the password has been sent to this address.
            </BaseText>
            <BaseButton onClick={() => navigate("/login")} maxWidth={"500px"}>
              Back to login
            </BaseButton>
          </>
        ) : (
          <>
            <BaseInput<ResetPaswordData>
              width="500px"
              name="email"
              placeholder="E-Mail"
              validate={validator["email"]}
              showErrMessage={true}
            />

            <BaseButton
              width="500px"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Reset password now
            </BaseButton>
          </>
        )}
      </FormProvider>
    </Stack>
  );
}
