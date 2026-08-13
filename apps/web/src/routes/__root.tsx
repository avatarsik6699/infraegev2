import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
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

const impeccableDirection = `THESIS: Editorial Rail makes explanation, mechanism and practice one continuous argument; it refuses the card-dashboard lesson. OWN-WORLD: warm ruled paper-like fields, ink serif reading, compact sans and mono labels, burnt-orange causal evidence, square diagrams and minimal chrome. STORY: the learner sees why binary search can discard candidates, follows the exact evidence, then tries the rule with help available. FIRST VIEWPORT: two full-width header rules sit above a three-column lesson; nested outline left, title and three-stage array proof center, aligned causal marginalia right, practice follows below. FORM: approved Editorial Rail, grounded candidate 7, seed ded7b27c. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`;

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
        <template
          data-impeccable-direction="ded7b27c"
          dangerouslySetInnerHTML={{ __html: impeccableDirection }}
        />
        <AppProviders>{props.children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}
