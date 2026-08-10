import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import mantineCss from "@mantine/core/styles.css?url";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { env } from "~/shared/config/env";
import { appMantineTheme } from "~/shared/config/mantine-theme";
import appCss from "~/shared/styles/tokens.css?url";
import { SiteFooter } from "~/widgets/site-footer";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "stylesheet", href: mantineCss },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <HeadContent />
        {env.client.umamiWebsiteId && (
          <script
            defer
            src="/stats/script.js"
            data-website-id={env.client.umamiWebsiteId}
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
          <Outlet />
          <SiteFooter />
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  );
}
