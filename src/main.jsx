import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import { registerSW } from "virtual:pwa-register";

// FORCE UPDATE MECHANISM
const updateSW = registerSW({
  onNeedRefresh() {
    const confirmUpdate = window.confirm(
      "A new version of the app is available. Click OK to update."
    );

    if (confirmUpdate) {
      updateSW(true); // reloads the app with the new version
    }
  },

  onOfflineReady() {
    console.log("App is ready to work offline");
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);