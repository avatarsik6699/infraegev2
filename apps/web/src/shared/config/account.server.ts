/** Internal API address used only by account route loaders. */
export const accountServerConfig = {
  apiUrl: process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000",
} as const;
