import type { components } from "~/shared/api/schema";

type Account = components["schemas"]["AccountView"];

/** Change 227: the action a sign-in confirmation is for; the API returns it as `resume`. */
export type ResumeIntent = NonNullable<
  components["schemas"]["ProviderReauthRequest"]["resume"]
>;

const INTENTS: readonly ResumeIntent[] = [
  "link:vk",
  "link:yandex",
  "unlink:vk",
  "unlink:yandex",
  "delete",
  "email",
];

/** Codes the provider callback sends back instead of an error page (Change 227). */
export type AuthError =
  "expired" | "cancelled" | "failed" | "other_account" | "already_linked";

const AUTH_ERRORS: readonly AuthError[] = [
  "expired",
  "cancelled",
  "failed",
  "other_account",
  "already_linked",
];

export const recentAuth = {
  /** Login methods and deletion change without a new confirmation until then. */
  isRecent: (account: Account, now = Date.now()) =>
    Date.parse(account.recent_auth_until) > now,
  intent: (value: unknown): ResumeIntent | undefined =>
    INTENTS.find((intent) => intent === value),
  authError: (value: unknown): AuthError | undefined =>
    AUTH_ERRORS.find((code) => code === value),
};

/** Search parameters of /account and /sign-in, validated by their routes. */
export const accountSearch = {
  profile: (
    search: Record<string, unknown>,
  ): {
    tab?: "access" | "settings";
    resume?: ResumeIntent;
    auth_error?: AuthError;
  } => ({
    ...(search.tab === "access" || search.tab === "settings"
      ? { tab: search.tab }
      : {}),
    ...(recentAuth.intent(search.resume)
      ? { resume: recentAuth.intent(search.resume) }
      : {}),
    ...(recentAuth.authError(search.auth_error)
      ? { auth_error: recentAuth.authError(search.auth_error) }
      : {}),
  }),
  signIn: (
    search: Record<string, unknown>,
  ): { returnTo?: string; auth_error?: AuthError } => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
    ...(recentAuth.authError(search.auth_error)
      ? { auth_error: recentAuth.authError(search.auth_error) }
      : {}),
  }),
};
