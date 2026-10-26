import { createFileRoute } from "@tanstack/react-router";
import { getProviderAvailability } from "~/features/account";
import { AccountPage, accountSearch } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/sign-in")({
  validateSearch: accountSearch.signIn,
  loader: () => getProviderAvailability().catch(() => []),
  // Change 194: account and sign-in pages stay out of search, `returnTo` variants included.
  head: () =>
    pageHead.create({
      title: "Вход — Кодумка",
      description: "Вход в аккаунт Кодумки.",
      path: "/sign-in",
      noIndex: true,
    }),
  component: SignInRoute,
});
function SignInRoute() {
  return (
    <AccountPage
      mode="sign-in"
      returnTo={Route.useSearch().returnTo}
      authError={Route.useSearch().auth_error}
      enabledProviders={Route.useLoaderData()}
    />
  );
}
