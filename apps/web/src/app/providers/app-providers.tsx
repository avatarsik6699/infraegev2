import { ClientErrorMonitor } from "./components/client-error-monitor";
import { AppNavigationProgress } from "./components/navigation-progress";
import type { AppProvidersTypes } from "./app-providers.types";

export const AppProviders: React.FC<AppProvidersTypes.Props> = (props) => (
  <>
    <AppNavigationProgress />
    <ClientErrorMonitor />
    {props.children}
  </>
);
