import { createFileRoute } from "@tanstack/react-router";
import { CheckoutReturnPage } from "~/pages/checkout";
import { pageHead } from "~/shared/lib/seo";

// Change 230: Robokassa appends its own query to SuccessUrl2, so only the leading id is ours
const paymentId =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/iu;

/** Robokassa's SuccessURL and FailURL: the status comes from the API only. */
export const Route = createFileRoute("/subscribe_/return")({
  validateSearch: (search: Record<string, unknown>): { payment?: string } => {
    const id =
      typeof search.payment === "string"
        ? paymentId.exec(search.payment)?.[0]
        : undefined;
    return id ? { payment: id } : {};
  },
  head: () =>
    pageHead.create({
      title: "Оплата — Кодумка",
      description: "Состояние оплаты доступа к урокам Кодумки.",
      path: "/subscribe/return",
      noIndex: true,
    }),
  component: SubscribeReturnRoute,
});

function SubscribeReturnRoute() {
  return <CheckoutReturnPage paymentId={Route.useSearch().payment} />;
}
