"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
  duration: 3000,
});

export const Toaster = () => {
  const { t } = useTranslation();
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title>
                  {typeof toast.title === "string"
                    ? t(toast.title)
                    : toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description>
                  {" "}
                  {typeof toast.description === "string"
                    ? t(toast.description)
                    : toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>
                {typeof toast.action.label === "string"
                  ? t(toast.action.label)
                  : toast.action.label}
              </Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
