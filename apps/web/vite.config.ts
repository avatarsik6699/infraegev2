import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import {
  courseLessonPublications,
  coursePublications,
} from "./src/entities/course/content/course-publication.mjs";
import { lessonPublications } from "./src/entities/lesson/content/lesson-publication.mjs";

const isPublishedPrerenderPath = (
  path: string,
  publishedLessonPaths: ReadonlySet<string>,
  publishedCoursePaths: ReadonlySet<string>,
): boolean =>
  [
    !path.startsWith("/lab/"),
    !path.startsWith("/ege/") || publishedLessonPaths.has(path),
    !path.startsWith("/courses/") || publishedCoursePaths.has(path),
  ].every(Boolean);

export default defineConfig((configEnv) => {
  const apiProxyTarget =
    process.env.VITE_PROXY_TARGET ?? "http://localhost:8000";
  const publishedLessonPaths = new Set(
    lessonPublications
      .filter(({ status }) => status === "published")
      .map(({ routeSlug }) => `/ege/${routeSlug}`),
  );
  const publishedCoursePaths = new Set(
    coursePublications
      .filter(({ status }) => status === "published")
      .flatMap(({ routeSlug }) => [
        `/courses/${routeSlug}`,
        ...courseLessonPublications
          .filter(({ status }) => status === "published")
          .map(
            ({ routeSlug: lessonRouteSlug }) =>
              `/courses/${routeSlug}/${lessonRouteSlug}`,
          ),
      ]),
  );

  return {
    build: {
      // The app's route CSS is small, while each split stylesheet adds a render-blocking round
      // trip before the prerendered heading can paint. One compressed stylesheet keeps the
      // no-JS document styled and leaves JavaScript route chunks split.
      cssCodeSplit: false,
    },
    preview: {
      // TanStack Start prerendering starts Vite preview on an ephemeral port and fetches it from
      // the same process. Bind IPv4 explicitly so BuildKit does not resolve the advertised
      // loopback URL to an address family the preview server is not listening on.
      host: "127.0.0.1",
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tanstackStart({
        router: {
          codeSplittingOptions: {
            splitBehavior: ({ routeId }) => {
              if (routeId.startsWith("/courses")) {
                return [
                  ["loader", "component"],
                  ["errorComponent"],
                  ["notFoundComponent"],
                ];
              }
              return undefined;
            },
          },
        },
        prerender: {
          // The foundation route is static and must remain readable without JavaScript.
          enabled: true,
          crawlLinks: true,
          // The lesson lab is an unlisted design proof, not published content.
          filter: ({ path }) =>
            isPublishedPrerenderPath(
              path,
              publishedLessonPaths,
              publishedCoursePaths,
            ),
          failOnError: true,
        },
      }),
      // Emit a directly runnable Node server for the production container. In local serve mode,
      // Nitro owns the request pipeline, so its route rule (rather than Vite's server.proxy)
      // forwards browser /api calls to FastAPI. Production routes /api through Nginx instead.
      nitro({
        compressPublicAssets: { gzip: true, brotli: true },
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
