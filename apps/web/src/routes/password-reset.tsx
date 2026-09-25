import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "~/pages/account";
export const Route = createFileRoute("/password-reset")({
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
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
