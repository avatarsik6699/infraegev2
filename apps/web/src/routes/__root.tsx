import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { AppRouterContext } from "~/router";
import { AppProviders, RouteError } from "~/app";
import { AnalyticsConsentPrompt } from "~/features/analytics";
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
        href: "/fonts/alchimia/cormorant-sc-cyrillic-600.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/alchimia/cormorant-sc-latin-600.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
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
      {
        rel: "preload",
        href: "/fonts/alchimia/ibm-plex-mono-cyrillic-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/alchimia/ibm-plex-mono-latin-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/alchimia/ibm-plex-mono-cyrillic-600.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/alchimia/ibm-plex-mono-latin-600.woff2",
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
      <AnalyticsConsentPrompt />
    </>
  );
}

function RootDocument(props: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppProviders>{props.children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}
