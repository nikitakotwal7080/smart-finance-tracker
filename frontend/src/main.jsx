import "./i18n";          // ← must be first
 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";            // adjust path if your root component differs
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);