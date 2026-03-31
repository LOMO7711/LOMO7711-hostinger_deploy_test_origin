import { Spacer, Spinner, Stack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import errorCodes from "../../constants/errorCodes";
import useRequest, { ApiErrors } from "../../hooks/useRequest";
import { BaseButton } from "../base/BaseButton";
import { BaseText } from "../base/BaseText";
import { RegistrationHeader } from "./RegistrationHeader";

export default function EmailCallback() {
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const { t: translate } = useTranslation();
  const [, onApiRequest] = useRequest((errors: ApiErrors) => {
    const key = Object.keys(errors)[0];
    setError(errors[key]);
  });
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const hasId = Boolean(id);
    setIsValid(hasId);
    if (hasId) {
      (async () => {
        try {
          await onApiRequest(`users/register/callback/${id}`);
          navigate("/register/success");
        } catch (e) {
          console.error("error inn register.callback", e);
        }
      })();
    }
  }, []);
  const err = error || translate(errorCodes["invalid_register_link"]);
  if (isValid === false || error)
    return (
      <VStack h={"100vh"}>
        <Spacer />
        <RegistrationHeader />
        <BaseText>{err}</BaseText>
        <BaseButton maxW={"300px"} onClick={() => navigate("/register")}>
          Back to registration
        </BaseButton>
        <Spacer />
      </VStack>
    );

  if (isValid === null) return null;

  return (
    <Stack>
      <Spinner />
    </Stack>
  );
}
