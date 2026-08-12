import "@tanstack/react-start/server-only";

/** Read per request so server runtimes can inject environment variables after module loading. */
export function getSiteUrl(): string {
  return process.env.SITE_URL ?? "https://example.invalid";
}
