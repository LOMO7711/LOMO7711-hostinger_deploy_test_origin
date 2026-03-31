import { Stack } from "@chakra-ui/react";
import { BaseText } from "../base/BaseText";

export function AuthHeaderSection({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Stack>
      <BaseText textAlign={"center"} fontSize={48} fontWeight={"bold"}>
        {title}
      </BaseText>
      <BaseText textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
        {description ?? ""}
      </BaseText>
    </Stack>
  );
}
