import { Button, ButtonProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type ButtonPropsType = {
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: string;
};

export function BaseButton({
  isLoading,
  disabled,
  onClick,
  children,
  ...rest
}: ButtonPropsType & ButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      width={"100%"}
      fontWeight={"semibold"}
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {t(children)}
    </Button>
  );
}
