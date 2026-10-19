import { createFileRoute, redirect } from "@tanstack/react-router";
import { AccountPage } from "~/pages/account";
import { pageHead } from "~/shared/lib/seo";
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
  // Change 194: account and sign-in pages stay out of search, `returnTo` variants included.
  head: () =>
    pageHead.create({
      title: "Подтверждение почты — Кодумка",
      description: "Подтверждение почты для аккаунта Кодумки.",
      path: "/verify-email",
      noIndex: true,
    }),
  component: VerifyEmailRoute,
});
