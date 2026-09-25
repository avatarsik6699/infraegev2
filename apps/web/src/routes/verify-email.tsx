import { createFileRoute, redirect } from "@tanstack/react-router";
import { AccountPage } from "~/pages/account";
const VerifyEmailRoute: React.FC = () => {
  const { token } = Route.useSearch();
  return <AccountPage mode="verify" token={token} />;
};
export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (!search.token)
      throw redirect({ to: "/register", search: { returnTo: undefined } });
  },
  component: VerifyEmailRoute,
});
