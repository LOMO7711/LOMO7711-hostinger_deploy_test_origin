import { createRoot } from "react-dom/client";
import { Provider as JotaiProvider } from "jotai";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import RedirectCallback from "./components/RedirectCallBack";
import SessionWrapper from "./components/SessionWrapper";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ResetPassword from "./components/resetPassword/ResetPassword";
import { system } from "./constants/chakraConfig";
import EmailCallback from "./components/register/EmailCallback";
import ResetPasswordCallback from "./components/resetPassword/callback/ResetPasswordCallback";
import Logout from "./components/Logout";
import "./i18n";
import App from "./App";
import AccountCreated from "./components/register/AccountCreated";
import GoogleCallback from "./components/GoogleCallback";
import NavBar from "./components/NarBar";
import UpdateUserExample from "./components/UpdateUserExample";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <JotaiProvider>
    <BrowserRouter>
      <ChakraProvider value={system}>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <SessionWrapper>
                <NavBar />
                <Outlet />
              </SessionWrapper>
            }
          >
            <Route path="/updateUser" element={<UpdateUserExample />} />
            <Route path="/home" element={<App />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />

          <Route path="/register/callback" element={<EmailCallback />} />
          <Route path="/callback/google" element={<GoogleCallback />} />
          <Route path="/register/success" element={<AccountCreated />} />
          <Route
            path="/emailchange/callback"
            element={
              <RedirectCallback
                title="E-Mail geändert"
                description=" Deine E-Mail geändert. Du kannst dich jetzt einloggen"
              />
            }
          />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route
            path="/resetPassword/callback"
            element={<ResetPasswordCallback />}
          />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </JotaiProvider>
);
