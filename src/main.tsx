import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./i18n";
import App from "./App";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App/>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
);
