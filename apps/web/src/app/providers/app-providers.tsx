import { MantineProvider } from "@mantine/core";
import { CodeHighlightAdapterProvider } from "@mantine/code-highlight";
import { appCodeHighlightAdapter } from "../config/code-highlight";
import { appMantineTheme } from "../config/mantine-theme";
import { ClientErrorMonitor } from "./components/client-error-monitor";
import { AppNavigationProgress } from "./components/navigation-progress";
import type { AppProvidersTypes } from "./app-providers.types";

export const AppProviders: React.FC<AppProvidersTypes.Props> = (props) => (
  <MantineProvider
    theme={appMantineTheme}
    defaultColorScheme="light"
    forceColorScheme="light"
  >
    <CodeHighlightAdapterProvider adapter={appCodeHighlightAdapter}>
      <AppNavigationProgress />
      <ClientErrorMonitor />
      {props.children}
    </CodeHighlightAdapterProvider>
  </MantineProvider>
);
