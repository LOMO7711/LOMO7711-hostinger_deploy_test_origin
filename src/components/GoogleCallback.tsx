import { Spacer, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import errorCodes from "../constants/errorCodes";
import useRequest from "../hooks/useRequest";
import { BaseButton } from "./base/BaseButton";
import { RegistrationHeader } from "./register/RegistrationHeader";

export default function GoogleCallback() {
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation();
  const [{ isLoading }, onApiRequest] = useRequest(() => setIsError(true));
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) setIsError(true);
    else {
      (async () => {
        try {
          let url = `users/callback/google?code=${code}`;
          const state = params.get("state");
          if (state) url += `&state=${state}`;

          const { data } = await onApiRequest(url);
          const searchParams = new URLSearchParams();
          if (data.authProvider)
            searchParams.set("authProvider", data.authProvider);
          if (data.isCreated) searchParams.set("isCreated", "true");
          if (data.asFallbackCreated)
            searchParams.set("asFallbackCreated", "true");
          let route = data?.isCreated ? "/register/success?" : "/?";
          route += searchParams.toString();
          navigate(route);
        } catch (e) {
          console.error("error in google.register.callback", e);
        }
      })();
    }
  }, []);
  if (isError)
    return (
      <VStack h={"100vh"}>
        <Spacer />
        <RegistrationHeader />
        <Text>{t(errorCodes["unknown"])}</Text>
        <BaseButton maxWidth={"300px"} onClick={() => navigate("/register")}>
          Back to registration
        </BaseButton>
        <Spacer />
      </VStack>
    );
  if (isLoading)
    return (
      <Stack>
        <Spinner />
      </Stack>
    );
  return null;
}
