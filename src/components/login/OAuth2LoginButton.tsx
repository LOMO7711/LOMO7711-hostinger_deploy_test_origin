import { HStack, Image, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type OAuthLoginButtonProps = {
  icon: string;
  text: string;
  loading: boolean;
  disabled: boolean;
  onLogin: () => void;
};

export function OAuth2LoginButton({
  icon,
  text,
  loading,
  disabled,
  onLogin,
}: OAuthLoginButtonProps) {
  const { t } = useTranslation();
  const isBlocked = loading || disabled;
  return (
    <HStack
      cursor={isBlocked ? "disabled" : "pointer"}
      onClick={isBlocked ? undefined : onLogin}
      px={3}
      h={"48px"}
      width={"100%"}
      justifyContent={"space-evenly"}
      borderRadius={"md"}
      fontWeight={"bold"}
      bgColor={"#1E1E1E"}
      color={"white"}
    >
      {loading ? <Spinner size={"md"} /> : <Image src={icon} h={"30px"} />}
      <Text textAlign={"center"} fontSize={"sm"} lineHeight={0.9}>
        {t(text)}
      </Text>
    </HStack>
  );
}
