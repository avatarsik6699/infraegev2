/** Public build-time configuration. Every value in this module is allowed in the client bundle. */
export const clientEnv = {
  // Node's standards-compliant Request implementation used by Vitest requires an absolute URL;
  // browsers resolve generated absolute API paths against the same origin.
  apiBasePath: import.meta.env.MODE === "test" ? "http://localhost" : "",
} as const;
