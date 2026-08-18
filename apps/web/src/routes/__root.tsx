import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { AppRouterContext } from "~/router";
import { AppProviders, RouteError } from "~/app";
import { clientEnv } from "~/shared/config/client-env";
import "~/app/styles.css";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UI foundation" },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/literata/literata-cyrillic-wght-normal.df20f1a8.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/literata/literata-latin-wght-normal.9adbeac5.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
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
    <html lang="ru">
      <head>
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
        <AppProviders>{props.children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}
