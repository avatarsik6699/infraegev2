import {
  loadTaskSitemapIndex,
  loadTaskSitemapPage,
} from "~/entities/practice-task";
import { siteConfig } from "~/shared/config/site";
import { publicPaths } from "../public-paths";

function escape(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
}
function xml(body: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
function urlset(entries: { path: string; updated?: string }[]) {
  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((entry) => `<url><loc>${escape(siteConfig.origin + entry.path)}</loc>${entry.updated ? `<lastmod>${escape(entry.updated)}</lastmod>` : ""}</url>`).join("")}</urlset>`,
  );
}
function unavailable() {
  return new Response("Sitemap temporarily unavailable", {
    status: 503,
    headers: { "Cache-Control": "no-store", "Retry-After": "60" },
  });
}
async function index() {
  try {
    const data = await loadTaskSitemapIndex();
    const paths = [
      "/sitemap-static.xml",
      ...Array.from(
        { length: data.pages },
        (_, index) => `/sitemap-practice/${index + 1}`,
      ),
    ];
    return xml(
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<sitemap><loc>${escape(siteConfig.origin + path)}</loc></sitemap>`).join("")}</sitemapindex>`,
    );
  } catch {
    return unavailable();
  }
}
async function tasks(page: string) {
  if (!/^[1-9]\d{0,4}$/.test(page) || Number(page) > 49999)
    return new Response("Not found", { status: 404 });
  try {
    const data = await loadTaskSitemapPage(Number(page));
    if (data.tasks.length === 0)
      return new Response("Not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    return urlset(
      data.tasks.map((task: { id: string; updated_at: string }) => ({
        path: `/practice/${task.id}`,
        updated: task.updated_at,
      })),
    );
  } catch {
    return unavailable();
  }
}
export const sitemaps = {
  index,
  tasks,
  static: () => urlset(publicPaths.map((path) => ({ path }))),
};
