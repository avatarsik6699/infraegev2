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
import { SiteFooter } from "~/widgets/site-footer";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
  }),
  shellComponent: RootDocument,
  errorComponent: (props) => (
    <>
      <RouteError {...props} />
      <SiteFooter />
    </>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <SiteFooter />
    </>
  );
}

function RootDocument(props: { children: React.ReactNode }) {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
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
