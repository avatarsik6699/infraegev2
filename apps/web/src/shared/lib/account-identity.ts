import type { components } from "~/shared/api/schema";

type Account = Pick<components["schemas"]["AccountView"], "email" | "methods">;

const METHOD_LABELS: Record<string, string> = {
  email: "почта и пароль",
  vk: "VK ID",
  yandex: "Яндекс ID",
};

/**
 * Change 228: how an account is shown wherever it appears (header, profile, checkout), so the
 * avatar and the name never disagree between pages.
 */
export const accountIdentity = {
  /** The avatar letter: the address's first letter, else a neutral «П» (профиль). */
  initial: (account: Account) =>
    account.email?.trim().at(0)?.toLocaleUpperCase("ru") ?? "П",
  /** The ways into this account, as a reader names them. */
  methods: (account: Account) =>
    account.methods.map(
      (method) => METHOD_LABELS[method.provider] ?? method.provider,
    ),
};
