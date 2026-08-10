import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { opsMantineTheme } from "./shared/config/mantine-theme";
import "./shared/styles/tokens.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={opsMantineTheme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
