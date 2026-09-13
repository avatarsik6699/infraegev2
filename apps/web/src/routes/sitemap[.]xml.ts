import { createFileRoute } from "@tanstack/react-router";
import { sitemaps } from "~/pages/site-discovery";
export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => sitemaps.index() } },
});
