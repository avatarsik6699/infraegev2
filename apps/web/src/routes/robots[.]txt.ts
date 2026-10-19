import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "~/shared/config/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          // Change 194: account and sign-in pages carry `noindex`, so robots must still
          // reach them; only machine endpoints are closed. Yandex drops the service
          // parameters that make one page look like many.
          [
            "User-agent: *",
            "Allow: /",
            "Disallow: /api/",
            "Disallow: /_serverFn/",
            "Clean-param: returnTo&from&plan",
            "",
            `Sitemap: ${siteConfig.origin}/sitemap.xml`,
            "",
          ].join("\n"),
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
