import { createFileRoute } from "@tanstack/react-router";
import { getAccessState } from "~/entities/access";
import { getOffer } from "~/entities/billing";
import {
  getAccountCourseSummary,
  getAccountTopicSummary,
  getProviderAvailability,
} from "~/features/account";
import { AccountPage } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/account")({
  // Change 192: «Раздел «Доступ»» links open the profile on that tab.
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: "access" | "settings" } =>
    search.tab === "access" || search.tab === "settings"
      ? { tab: search.tab }
      : {},
  loader: async () => {
    const [practiceSummary, topicSummary, enabledProviders, offer, access] =
      await Promise.all([
        getAccountCourseSummary().catch(() => null),
        getAccountTopicSummary().catch(() => null),
        getProviderAvailability().catch(() => []),
        // Change 192: the «Доступ» tab exists while selling is on
        getOffer().catch(() => undefined),
        getAccessState().catch(() => undefined),
      ]);
    return {
      practiceSummary,
      topicSummary,
      enabledProviders,
      billing: offer?.billing ? { access } : undefined,
    };
  },
  // Change 194: account and sign-in pages stay out of search, `returnTo` variants included.
  head: () =>
    pageHead.create({
      title: "Аккаунт — Кодумка",
      description: "Профиль, прогресс и доступ к урокам Кодумки.",
      path: "/account",
      noIndex: true,
    }),
  component: AccountRoute,
});

function AccountRoute() {
  const data = Route.useLoaderData();
  return (
    <AccountPage
      mode="profile"
      practiceSummary={data.practiceSummary}
      topicSummary={data.topicSummary}
      enabledProviders={data.enabledProviders}
      billing={data.billing}
      tab={Route.useSearch().tab}
    />
  );
}
