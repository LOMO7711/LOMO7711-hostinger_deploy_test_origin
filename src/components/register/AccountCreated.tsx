import { Spacer, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { BaseButton } from "../base/BaseButton";
import { AuthHeaderSection } from "./AuthHeaderSection";

export default function AccountCreated() {
  const navigate = useNavigate();
  return (
    <VStack h={"100vh"}>
      <Spacer />
      <AuthHeaderSection
        title="Account created"
        description="Starte jetzt unsere Plattform zu nutzen"
      />
      <BaseButton maxWidth={"200px"} onClick={() => navigate("/")}>
        start now
      </BaseButton>
      <Spacer />
    </VStack>
  );
}
