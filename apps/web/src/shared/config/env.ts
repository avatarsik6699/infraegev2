/**
 * The only file (besides runtime.ts) that reads env vars directly — everywhere else, import
 * `env.client.*`/`env.server.*`. Deliberately reduced from the reference project's version: no
 * API-base-URL/auth machinery, since this app has neither a separate API origin (nginx proxies
 * same-origin `/api` in prod; vite.config.ts's dev proxy locally) nor auth.
 *
 * `__CONTENT_ROOT__` is NOT read here — it's a vite `define` build-time constant
 * (docs/KNOWN_GOTCHAS.md), not a runtime env read; routing it through this module would resolve
 * it at the wrong time (after bundling, when the source-relative path no longer applies).
 */
export const env = {
  client: {
    apiBasePath: "/api",
    feedbackUrl:
      import.meta.env.VITE_FEEDBACK_URL ??
      "https://t.me/REPLACE_WITH_FEEDBACK_CHANNEL",
  },
  server: {
    get siteUrl(): string {
      return process.env.SITE_URL ?? "https://example.invalid";
    },
  },
};
