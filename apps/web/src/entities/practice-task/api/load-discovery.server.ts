import { practiceServerClient } from "./practice-server-client.server";
export async function loadTaskSitemapIndex() {
  const result = await practiceServerClient.GET("/api/task-sitemap-index", {
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!result.response.ok || !result.data)
    throw new Error("Discovery unavailable");
  return result.data;
}
export async function loadTaskSitemapPage(page: number) {
  const result = await practiceServerClient.GET("/api/task-sitemap", {
    params: { query: { page } },
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!result.response.ok || !result.data)
    throw new Error("Discovery unavailable");
  return result.data;
}
