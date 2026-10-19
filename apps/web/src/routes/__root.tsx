import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { AppRouterContext } from "~/router";
import { AppDocumentHead, AppProviders, RouteError } from "~/app";
import { getOffer } from "~/entities/billing";
import { siteConfig } from "~/shared/config/site";
import { SiteFlagsProvider } from "~/shared/lib/site-flags";
import "~/app/styles.css";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  // Change 192: the footer links plans, the offer and refunds only while selling
  // is on (BILLING_ENABLED); the server keeps the answer for a minute.
  loader: async () => ({
    billing: Boolean((await getOffer().catch(() => undefined))?.billing),
  }),
  staleTime: Infinity,
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
        href: "/fonts/onest/onest-cyrillic-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/onest/onest-latin-wght-normal.woff2",
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
  const flags = Route.useLoaderData();
  return (
    <SiteFlagsProvider value={flags}>
      <Outlet />
    </SiteFlagsProvider>
  );
}

/**
 * Pages the tracker never sees. A page load skips the script; after an in-app
 * navigation from a public page the tracker drops these paths itself
 * (`data-exclude`, smotryashchiy tracker, Change 194).
 */
const privatePaths = [
  "/account",
  "/sign-in",
  "/register",
  "/verify-email",
  "/password-reset",
] as const;

function RootDocument(props: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const allowAnalytics = !privatePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
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
            data-site="65a299a0318aa70e52b7d463"
            data-exclude={privatePaths.join(",")}
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
