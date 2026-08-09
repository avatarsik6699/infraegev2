import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

// Computed here (config authoring time, always run from source) rather than via
// `import.meta.dirname` inside the loader module itself: once bundled into .output/server/,
// the loader module's own location no longer matches the source tree, so a runtime-relative
// path from *there* resolves to the wrong place. Baking the absolute path in at build time
// keeps content/ resolvable in the built server output (docs/SPEC.md §3).
const CONTENT_ROOT = fileURLToPath(new URL("../../content", import.meta.url));

export default defineConfig((configEnv) => {
  const apiProxyTarget = process.env.VITE_PROXY_TARGET ?? "http://localhost:8000";

  return {
    preview: {
      // TanStack Start prerendering starts Vite preview on an ephemeral port and fetches it from
      // the same process. Bind IPv4 explicitly so BuildKit does not resolve the advertised
      // loopback URL to an address family the preview server is not listening on.
      host: "127.0.0.1",
    },
    server: {
      port: 3000,
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
      // Emit a directly runnable Node server for the production container. In local serve mode,
      // Nitro owns the request pipeline, so its route rule (rather than Vite's server.proxy)
      // forwards browser /api calls to FastAPI. Production routes /api through Nginx instead.
      nitro({
        routeRules:
          configEnv.command === "serve"
            ? {
                "/api/**": {
                  proxy: `${apiProxyTarget}/api/**`,
                },
              }
            : {},
      }),
      // react's vite plugin must come after start's vite plugin.
      viteReact(),
    ],
  };
});
