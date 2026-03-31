import { Box, Stack, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { BaseButton } from "./base/BaseButton";
import { AuthHeaderSection } from "./register/AuthHeaderSection";

export default function RedirectCallback({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack h={"100vh"} justifyContent={"space-around"} bgColor={"#e6e6e5"}>
        <VStack>
          <AuthHeaderSection title={title} description={description} />
          <BaseButton w={350} onClick={() => navigate("/")}>
            Zum Dashboard
          </BaseButton>
        </VStack>
      </Stack>
    </Box>
  );
}
