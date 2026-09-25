import { createFileRoute } from "@tanstack/react-router";
import { getProviderAvailability } from "~/features/account";
import { AccountPage } from "~/pages/account";
export const Route = createFileRoute("/sign-in")({
  validateSearch: (search) => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  loader: () => getProviderAvailability().catch(() => []),
  component: SignInRoute,
});
function SignInRoute() {
  return (
    <AccountPage
      mode="sign-in"
      returnTo={Route.useSearch().returnTo}
      enabledProviders={Route.useLoaderData()}
    />
  );
}
