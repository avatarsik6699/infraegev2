import { createFileRoute } from "@tanstack/react-router";
import { getProviderAvailability } from "~/features/account";
import { AccountPage } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/register")({
  validateSearch: (search) => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  loader: () => getProviderAvailability().catch(() => []),
  // Change 194: account and sign-in pages stay out of search, `returnTo` variants included.
  head: () =>
    pageHead.create({
      title: "Регистрация — Кодумка",
      description: "Создание аккаунта Кодумки.",
      path: "/register",
      noIndex: true,
    }),
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
