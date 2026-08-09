import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

// Computed here (config authoring time, always run from source) rather than via
// `import.meta.dirname` inside the loader module itself: once bundled into .output/server/,
// the loader module's own location no longer matches the source tree, so a runtime-relative
// path from *there* resolves to the wrong place. Baking the absolute path in at build time
// keeps content/ resolvable in the built server output (docs/SPEC.md §3).
const CONTENT_ROOT = fileURLToPath(new URL("../../content", import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    // Local dev only — production routes /api/ via Nginx (infra/nginx/nginx.conf) to the FastAPI
    // container. This lets PracticeTaskWidget's fetch("/api/tasks/...") work against `uv run
    // uvicorn` running on 8000 without needing the full Docker Compose stack up for frontend work.
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  define: {
    __CONTENT_ROOT__: JSON.stringify(CONTENT_ROOT),
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        // Every route in this change is static content (docs/SPEC.md §5.1) — enable build-time
        // prerendering so pages ship without needing a Node SSR process (docs/SPEC.md §7.1).
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    // react's vite plugin must come after start's vite plugin.
    viteReact(),
  ],
});
