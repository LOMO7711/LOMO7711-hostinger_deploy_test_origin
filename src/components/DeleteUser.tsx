import { Button } from "@chakra-ui/react";
import useRequest from "../hooks/useRequest";
import { useNavigate } from "react-router";

export default function DeleteUser() {
  const [{ isLoading }, onApiRequest] = useRequest(() => {
    alert("Nutzer konnte nicht geloscht werden");
  });
  const navigate = useNavigate();

  async function onDelete() {
    try {
      await onApiRequest("users", { method: "DELETE" });
      navigate("/login");
    } catch (e) {
      console.error("error in delete user", e);
    }
  }

  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      onClick={onDelete}
      w="200px"
    >
      Nuzter loeschen
    </Button>
  );
}
