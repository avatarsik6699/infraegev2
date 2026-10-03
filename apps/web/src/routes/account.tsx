import { createFileRoute } from "@tanstack/react-router";
import {
  getAccountCourseSummary,
  getAccountTopicSummary,
  getProviderAvailability,
} from "~/features/account";
import { AccountPage } from "~/pages/account";

export const Route = createFileRoute("/account")({
  loader: async () => ({
    practiceSummary: await getAccountCourseSummary().catch(() => null),
    topicSummary: await getAccountTopicSummary().catch(() => null),
    enabledProviders: await getProviderAvailability().catch(() => []),
  }),
  component: AccountRoute,
});

function AccountRoute() {
  return (
    <AccountPage
      mode="profile"
      practiceSummary={Route.useLoaderData().practiceSummary}
      topicSummary={Route.useLoaderData().topicSummary}
      enabledProviders={Route.useLoaderData().enabledProviders}
    />
  );
}
