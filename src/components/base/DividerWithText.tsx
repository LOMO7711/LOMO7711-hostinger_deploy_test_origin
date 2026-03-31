import { Box, HStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export function DividerWithText({ text }: { text: string }) {
  const { t } = useTranslation();

  const boxProps = {
    h: "2px",
    mt: "1px",
    width: "100%",
    bgColor: "#1E1E1E",
    borderRadius: "2px",
  };

  return (
    <HStack>
      <Box {...boxProps} />
      <Text fontSize={"sm"} fontWeight={"semibold"} whiteSpace="nowrap">
        {t(text)}
      </Text>
      <Box {...boxProps} />
    </HStack>
  );
}
