import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";

/** Change 198: the separate consent step after a first sign-in through VK ID or Яндекс ID. */
export const Route = createFileRoute("/register_/provider")({
  head: () =>
    pageHead.create({
      title: "Регистрация — Кодумка",
      description: "Создание аккаунта Кодумки.",
      path: "/register/provider",
      noIndex: true,
    }),
  component: ProviderConsentRoute,
});
function ProviderConsentRoute() {
  return <AccountPage mode="provider-consent" />;
}
