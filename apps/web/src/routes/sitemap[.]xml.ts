import { createFileRoute } from "@tanstack/react-router";
import { lessonPublications } from "~/entities/lesson";
import { siteConfig } from "~/shared/config/site";

const publicPaths = [
  "/",
  "/privacy",
  ...lessonPublications
    .filter((lesson) => lesson.status === "published")
    .map((lesson) => `/ege/${lesson.routeSlug}`),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...publicPaths.map(
              (path) => `  <url><loc>${siteConfig.origin}${path}</loc></url>`,
            ),
            "</urlset>",
            "",
          ].join("\n"),
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
