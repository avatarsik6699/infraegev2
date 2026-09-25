import { createFileRoute } from "@tanstack/react-router";
import {
  getAccountCourseSummary,
  getProviderAvailability,
} from "~/features/account";
import { AccountPage } from "~/pages/account";

export const Route = createFileRoute("/account")({
  loader: async () => ({
    practiceSummary: await getAccountCourseSummary().catch(() => null),
    enabledProviders: await getProviderAvailability().catch(() => []),
  }),
  component: AccountRoute,
});

function AccountRoute() {
  return (
    <AccountPage
      mode="profile"
      practiceSummary={Route.useLoaderData().practiceSummary}
      enabledProviders={Route.useLoaderData().enabledProviders}
    />
  );
}
