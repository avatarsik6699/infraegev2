import { createFileRoute } from "@tanstack/react-router";
import { sitemaps } from "~/pages/site-discovery";
export const Route = createFileRoute("/sitemap-practice/$page")({
  server: { handlers: { GET: ({ params }) => sitemaps.tasks(params.page) } },
});
