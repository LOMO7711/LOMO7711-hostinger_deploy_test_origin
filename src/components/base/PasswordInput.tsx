import { Field } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createMailAndPasswordValdiator } from "../../utils/createValidator";
import { getPasswordStrength } from "../../utils/getPasswordStrength";
import {
  PasswordInput,
  PasswordStrengthInfo,
  PasswordStrengthMeter,
} from "../ui/password-input";

export function BasePasswordInput() {
  const { t } = useTranslation();
  const { register, watch } = useFormContext();

  const passwordValue = watch("password");
  const mailAndPasswordValidator = createMailAndPasswordValdiator();
  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <Field.Root invalid={passwordStrength < 3 ? true : false}>
      <PasswordInput
        placeholder={t("Password")}
        {...register("password", {
          ...mailAndPasswordValidator["password"],
          required: "This field is required",
        })}
      />
      <PasswordStrengthMeter value={passwordStrength} max={4} width={"100%"} />
      <Field.ErrorText>
        <PasswordStrengthInfo password={passwordValue ?? ""} />
      </Field.ErrorText>
    </Field.Root>
  );
}
