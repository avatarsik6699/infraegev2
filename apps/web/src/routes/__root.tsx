import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { SiteFooter } from "~/components/SiteFooter";
import appCss from "~/styles/tokens.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
