import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/password-reset")({
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  // Change 194: account and sign-in pages stay out of search, `returnTo` variants included.
  head: () =>
    pageHead.create({
      title: "Восстановление пароля — Кодумка",
      description: "Восстановление пароля от аккаунта Кодумки.",
      path: "/password-reset",
      noIndex: true,
    }),
  component: PasswordResetRoute,
});
function PasswordResetRoute() {
  const { token, returnTo } = Route.useSearch();
  return (
    <AccountPage
      mode={token ? "new-password" : "recovery"}
      token={token}
      returnTo={returnTo}
    />
  );
}
