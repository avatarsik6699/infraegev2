import { createFileRoute } from "@tanstack/react-router";
import { listPublishedTopics } from "~/content/server-loaders";

/**
 * Build-time sitemap generation from `published` content (docs/SPEC.md §8) — no separate CMS/API
 * to query, so this reads the same content/ directory the pages themselves render from.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Sitemap <loc> entries must be absolute (sitemaps.org spec) — SITE_URL is unset until
        // the domain is chosen (docs/SPEC.md §7.1), so this falls back to a clearly-fake host
        // rather than emitting invalid relative URLs.
        const siteUrl = process.env.SITE_URL ?? "https://example.invalid";
        const topics = await listPublishedTopics();
        const urls = topics
          .map(
            (topic) =>
              `  <url><loc>${siteUrl}/theory/zadanie-${topic.task_numbers[0]}-${topic.id}</loc></url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc></url>
${urls}
</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
