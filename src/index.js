import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AlertProvider } from "./Components/Alert/AlertContext";
import AppWrapper from "./Appwraper";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter >
    <AlertProvider>
      <AppWrapper  />
    </AlertProvider>
  </BrowserRouter>
);
