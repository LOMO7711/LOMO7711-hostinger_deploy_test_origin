import { Text, TextProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function BaseText({
  children,
  ...rest
}: { children: string } & TextProps) {
  const { t } = useTranslation();
  return <Text {...rest}>{t(children)}</Text>;
}
