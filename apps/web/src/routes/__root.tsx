import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { AppRouterContext } from "~/router";
import { ClientErrorMonitor } from "~/shared/components/client-error-monitor";
import { clientEnv } from "~/shared/config/client-env";
import { appMantineTheme } from "~/shared/config/mantine-theme";
import { AppNavigationProgress } from "~/shared/components/navigation-progress";
import { RouteError } from "~/shared/components/route-state";
import "~/shared/styles/tokens.css";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UI foundation" },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: RouteError,
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}

function RootDocument(props: { children: React.ReactNode }) {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="icon" href="data:," />
        <HeadContent />
        {clientEnv.umamiWebsiteId && (
          <script
            defer
            src="/stats/script.js"
            data-website-id={clientEnv.umamiWebsiteId}
            data-domains="infraege.ru"
            data-do-not-track="true"
            data-exclude-search="true"
            data-exclude-hash="true"
          />
        )}
      </head>
      <body>
        <MantineProvider
          theme={appMantineTheme}
          defaultColorScheme="light"
          forceColorScheme="light"
        >
          <AppNavigationProgress />
          <ClientErrorMonitor />
          {props.children}
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  );
}
