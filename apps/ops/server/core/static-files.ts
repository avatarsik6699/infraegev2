import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import type { ServerResponse } from "node:http";
import { extname, join, normalize } from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function fileOrIndex(clientRoot: string, pathname: string): Promise<string> {
  const requested = pathname === "/"
    ? "index.html"
    : normalize(pathname)
        .replace(/^(\.\.(\/|\\|$))+/, "")
        .replace(/^\//, "");
  const candidate = join(clientRoot, requested);
  try {
    if ((await stat(candidate)).isFile()) return candidate;
  } catch {
    // SPA routes fall through to index.html.
  }
  return join(clientRoot, "index.html");
}

export async function sendStaticFile(
  response: ServerResponse,
  clientRoot: string,
  pathname: string,
): Promise<void> {
  const path = await fileOrIndex(clientRoot, pathname);
  response.writeHead(200, {
    "content-type": CONTENT_TYPES[extname(path)] ?? "application/octet-stream",
  });
  createReadStream(path).pipe(response);
}
