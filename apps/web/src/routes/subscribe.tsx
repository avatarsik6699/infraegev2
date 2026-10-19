import { createFileRoute, notFound } from "@tanstack/react-router";
import { getAccessState } from "~/entities/access";
import { getOffer } from "~/entities/billing";
import { safeReturnTo } from "~/features/account";
import { CheckoutPage } from "~/pages/checkout";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/subscribe")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { plan?: "month" | "year"; from?: string } => ({
    ...(search.plan === "year" || search.plan === "month"
      ? { plan: search.plan }
      : {}),
    ...(typeof search.from === "string" ? { from: search.from } : {}),
  }),
  loader: async () => {
    const [offer, access] = await Promise.all([getOffer(), getAccessState()]);
    if (!offer?.billing) throw notFound();
    return { offer, access };
  },
  head: () => ({
    ...pageHead.create({
      title: "Оформление доступа — Кодумка",
      description: "Оплата доступа к урокам Кодумки.",
      path: "/subscribe",
      noIndex: true,
    }),
  }),
  component: SubscribeRoute,
});

function SubscribeRoute() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  return (
    <CheckoutPage
      offer={data.offer}
      access={data.access}
      plan={search.plan ?? "month"}
      from={search.from ? safeReturnTo(search.from) : undefined}
    />
  );
}
