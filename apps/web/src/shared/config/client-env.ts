/** Public build-time configuration. Every value in this module is allowed in the client bundle. */
export const clientEnv = {
  apiBasePath: "/api",
  feedbackUrl:
    (import.meta.env.VITE_FEEDBACK_URL as string | undefined) ??
    "https://t.me/REPLACE_WITH_FEEDBACK_CHANNEL",
  umamiWebsiteId:
    (import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined) ?? "",
} as const;
