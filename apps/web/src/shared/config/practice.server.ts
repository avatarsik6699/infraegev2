export const practiceServerConfig = {
  apiUrl: process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000",
} as const;
