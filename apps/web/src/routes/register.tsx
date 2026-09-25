import { createFileRoute } from "@tanstack/react-router";
import { getProviderAvailability } from "~/features/account";
import { AccountPage } from "~/pages/account";
export const Route = createFileRoute("/register")({
  validateSearch: (search) => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  loader: () => getProviderAvailability().catch(() => []),
  component: RegisterRoute,
});
function RegisterRoute() {
  return (
    <AccountPage
      mode="register"
      returnTo={Route.useSearch().returnTo}
      enabledProviders={Route.useLoaderData()}
    />
  );
}
