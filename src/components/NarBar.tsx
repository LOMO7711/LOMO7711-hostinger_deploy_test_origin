import { Button, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import DeleteUser from "./DeleteUser";

export default function NavBar() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("de");
  }, []);

  return (
    <HStack
      alignContent={"center"}
      justifyContent={"center"}
      h="100px"
      w="100vw"
    >
      <Button onClick={() => navigate("/")}>Home</Button>
      <Button w="100px" onClick={() => navigate("/logout")}>
        Ausloggen
      </Button>
      <Button
        onClick={() => {
          navigate("/updateUser");
        }}
      >
        User Update Beispiel
      </Button>
      <DeleteUser />
    </HStack>
  );
}
