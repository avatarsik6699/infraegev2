import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { AppRouterContext } from "~/router";
import { AppDocumentHead, AppProviders, RouteError } from "~/app";
import { siteConfig } from "~/shared/config/site";
import "~/app/styles.css";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "application-name", content: siteConfig.name },
      { name: "theme-color", content: siteConfig.themeColor },
      { title: siteConfig.name },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/alegreya/alegreya-cyrillic-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/alegreya/alegreya-latin-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/golos-text/golos-text-cyrillic-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/golos-text/golos-text-latin-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      {
        rel: "icon",
        href: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        href: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: RouteError,
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}

function RootDocument(props: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const allowAnalytics =
    !pathname.startsWith("/account/") &&
    ![
      "/account",
      "/sign-in",
      "/register",
      "/verify-email",
      "/password-reset",
    ].includes(pathname);
  return (
    <html lang="ru">
      <head>
        <AppDocumentHead />
        {allowAnalytics ? (
          /* The external tracker is public-page only: it must never observe account
             routes or URL tokens used for verification and recovery. */
          <script
            async
            src="https://sre.infraege.ru/track.js"
            data-site="a98eb46cb1aa5116e1b5cefd"
          />
        ) : null}
      </head>
      <body>
        <AppProviders>{props.children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}
