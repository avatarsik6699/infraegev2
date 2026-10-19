import { createFileRoute, notFound } from "@tanstack/react-router";
import { getAccessState } from "~/entities/access";
import { getOffer } from "~/entities/billing";
import { safeReturnTo } from "~/features/account";
import { PricingPage } from "~/pages/pricing";
import { pageHead } from "~/shared/lib/seo";

const description =
  "Месяц или год полного доступа к урокам ЕГЭ по информатике: разовый платёж, без автопродления.";

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): { from?: string } =>
    typeof search.from === "string" ? { from: search.from } : {},
  loader: async () => {
    const [offer, access] = await Promise.all([getOffer(), getAccessState()]);
    // Change 192: plans exist only while selling is on (flag BILLING_ENABLED).
    if (!offer?.billing) throw notFound();
    return { offer, access };
  },
  head: () =>
    pageHead.create({
      title: "Доступ к урокам — Кодумка",
      description,
      path: "/pricing",
    }),
  component: PricingRoute,
});

function PricingRoute() {
  const data = Route.useLoaderData();
  const { from } = Route.useSearch();
  return (
    <PricingPage
      offer={data.offer}
      access={data.access}
      from={from ? safeReturnTo(from) : undefined}
    />
  );
}
