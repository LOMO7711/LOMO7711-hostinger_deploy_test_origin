import { Input, Stack, Text, StackProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  useFormContext,
  ValidationRule,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

type Validator = (formValue: string | undefined) => string | true;

interface BaseInputProps<TFieldValues extends FieldValues> extends StackProps {
  name: Path<TFieldValues>;
  placeholder?: string;
  errorMessage?: string;
  width?: string;
  showErrMessage?: boolean;
  required?: string | ValidationRule<boolean> | undefined;
  validate?: Validator;
  type?: HTMLInputElement["type"];
  RenderErrorMessage?: (props: {
    children?: ReactNode | ReactNode;
    text: string;
  }) => ReactNode;
}
function getErrMesage<TFieldValues extends FieldValues>(
  name: Path<TFieldValues>,
  errors: FieldErrors<FieldValues>,
  showErrMessage?: boolean
): string | undefined {
  if (!showErrMessage) return undefined;
  const err = errors[name];
  if (!err) return undefined;
  if (!err?.message) return undefined;
  return err.message as string;
}

function ErrorMessage({ text }: { text: string }) {
  if (!text) return null;
  return (
    <Text color="red" fontWeight={"bold"} fontSize={"xs"}>
      {text}
    </Text>
  );
}

export default function BaseInput<TFieldValues extends FieldValues>({
  width,
  name,
  required,
  validate,
  placeholder,
  showErrMessage,
  RenderErrorMessage,
  type,
  ...rest
}: BaseInputProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { t: translate } = useTranslation();
  const errMessage = getErrMesage<TFieldValues>(name, errors, showErrMessage);
  if (!width) width = "100%";

  const ErrMessage = errMessage
    ? React.createElement(RenderErrorMessage || ErrorMessage, {
        text: errMessage,
      })
    : null;

  return (
    <Stack width={width} {...rest}>
      <Input
        type={type}
        placeholder={placeholder && translate(placeholder)}
        width={width}
        {...register(name, {
          validate: validate ?? undefined,
          required: required ?? undefined,
        })}
        {...rest}
      />
      {ErrMessage}
    </Stack>
  );
}

export type { BaseInputProps };
