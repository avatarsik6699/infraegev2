/**
 * SSR/client detection. TanStack Start route loaders genuinely run on both server and client
 * (docs/KNOWN_GOTCHAS.md) — `isServer` double-checks both the Vite SSR flag and the absence of
 * `window`, since either alone can be wrong at the edges (e.g. a bundler quirk, a test env).
 */
function getSnapshot() {
  const hasWindow = typeof window !== "undefined";
  const isServer = import.meta.env.SSR && !hasWindow;
  return {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isServer,
    isClient: !isServer,
    hasWindow,
  };
}

export const runtime = {
  get isDev(): boolean {
    return getSnapshot().isDev;
  },
  get isProd(): boolean {
    return getSnapshot().isProd;
  },
  get isServer(): boolean {
    return getSnapshot().isServer;
  },
  get isClient(): boolean {
    return getSnapshot().isClient;
  },
  get hasWindow(): boolean {
    return getSnapshot().hasWindow;
  },
};
