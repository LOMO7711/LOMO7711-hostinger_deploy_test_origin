import { ReactNode, useEffect, useState } from "react";
import { User, useSetUser, useUser } from "../atoms/userAtom";
import { useLocation, useNavigate } from "react-router";
import request from "../utils/request";
import { useUpdateEffect } from "@chakra-ui/react";

export default function SessionWrapper({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const user = useUser();

  const setUser = useSetUser();
  const navigate = useNavigate();
  const location = useLocation();
  useUpdateEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);
  }, [location]);

  useEffect(() => {
    (async () => {
      try {
        const res = await request("users", { credentials: "include" });
        if (!res.ok) throw new Error("cannot load user data");
        const { user } = await res.json();
        if (!user)
          throw new Error("no user returned beside requets being sucessfull");
        setUser(user as User);
        navigate("/home");
      } catch (e) {
        console.error("error in init ", e);
        navigate("/login");
      }
    })();
  }, []);

  if (!isInitialized) return null;
  if (!user) return null;
  return <>{children}</>;
}
