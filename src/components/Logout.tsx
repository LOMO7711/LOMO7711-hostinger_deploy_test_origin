import { useEffect } from "react";
import { useNavigate } from "react-router";
import apiConfig from "../constants/apiConfig";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch(apiConfig.createUrl("session/logout"), {
      credentials: "include",
    }).finally(() => navigate("/login"));
  }, []);
  return null;
}
