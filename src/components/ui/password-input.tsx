"use client";

import type {
  ButtonProps,
  GroupProps,
  InputProps,
  StackProps,
} from "@chakra-ui/react";
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Text,
  mergeRefs,
  useControllableState,
} from "@chakra-ui/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaCheckSquare, FaSquare } from "react-icons/fa";
import { LuEye, LuEyeOff } from "react-icons/lu";

export interface PasswordVisibilityProps {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode };
}

export interface PasswordInputProps
  extends InputProps,
    PasswordVisibilityProps {
  rootProps?: GroupProps;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(props, ref) {
  const {
    rootProps,
    defaultVisible,
    visible: visibleProp,
    onVisibleChange,
    visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
    ...rest
  } = props;

  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible || false,
    onChange: onVisibleChange,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <InputGroup
      endElement={
        <VisibilityTrigger
          disabled={rest.disabled}
          onPointerDown={(e) => {
            if (rest.disabled) return;
            if (e.button !== 0) return;
            e.preventDefault();
            setVisible(!visible);
          }}
        >
          {visible ? visibilityIcon.off : visibilityIcon.on}
        </VisibilityTrigger>
      }
      {...rootProps}
    >
      <Input
        {...rest}
        ref={mergeRefs(ref, inputRef)}
        type={visible ? "text" : "password"}
      />
    </InputGroup>
  );
});

const VisibilityTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1}
        ref={ref}
        me="-2"
        aspectRatio="square"
        size="sm"
        variant="ghost"
        height="calc(100% - {spacing.2})"
        aria-label="Toggle password visibility"
        {...props}
      />
    );
  }
);

interface PasswordStrengthMeterProps extends StackProps {
  max?: number;
  value: number;
}

export const PasswordStrengthMeter = React.forwardRef<
  HTMLDivElement,
  PasswordStrengthMeterProps
>(function PasswordStrengthMeter(props, ref) {
  const { max = 4, value, ...rest } = props;
  const { t } = useTranslation();

  const percent = (value / max) * 100;
  const { label, colorPalette } = getColorPalette(percent);

  return (
    <Stack align="flex-end" gap="1" ref={ref} {...rest}>
      <HStack width="full" ref={ref} {...rest}>
        {Array.from({ length: max }).map((_, index) => (
          <Box
            key={index}
            height="1"
            flex="1"
            rounded="sm"
            data-selected={index < value ? "" : undefined}
            layerStyle="fill.subtle"
            colorPalette="gray"
            _selected={{
              colorPalette,
              layerStyle: "fill.solid",
            }}
          />
        ))}
      </HStack>
      {label && (
        <HStack textStyle="xs" fontWeight={"bold"}>
          {t(label)}
        </HStack>
      )}
    </Stack>
  );
});

function getColorPalette(percent: number) {
  switch (true) {
    case percent <= 25:
      return { label: "Low", colorPalette: "red" };
    case percent <= 50:
      return { label: "Medium", colorPalette: "orange" };
    case percent <= 75:
      return { label: "High", colorPalette: "green" };
    default:
      return { label: "Very High", colorPalette: "green" };
  }
}

export function PasswordStrengthInfo({ password }: { password: string }) {
  const Requirement = ({ valid, text }: { valid: boolean; text: string }) => {
    return (
      <HStack color={"black"}>
        {valid ? <FaCheckSquare color="green" /> : <FaSquare />}
        <Text>{text}</Text>
      </HStack>
    );
  };

  if (!password || !password.length) return null;

  return (
    <Stack>
      <Requirement
        text={"5-30 Characters"}
        valid={password.length >= 5 && password.length <= 30}
      />
      <Requirement
        text={"Small & Capital letters"}
        valid={/[a-z]/.test(password) && /[A-Z]/.test(password)}
      />
      <Requirement text={"At least one number"} valid={/\d/.test(password)} />
      <Requirement
        text={"At least one special character"}
        valid={/[\W_]/.test(password)}
      />
    </Stack>
  );
}
