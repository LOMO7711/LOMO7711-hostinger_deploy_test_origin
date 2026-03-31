import { Collapsible, HStack, Text } from "@chakra-ui/react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { IoMdWarning } from "react-icons/io";

export function ErrorMessage({
  error,
}: {
  error:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}) {
  if (!(typeof error === "string")) return null;
  return (
    <Collapsible.Root defaultOpen>
      <Collapsible.Content>
        <HStack gap={"4px"}>
          <IoMdWarning color={"red"} />
          <Text color={"red"} fontSize={"12px"} fontWeight={"bold"}>
            {error}
          </Text>
        </HStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
