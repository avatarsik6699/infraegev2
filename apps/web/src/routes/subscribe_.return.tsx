import { createFileRoute } from "@tanstack/react-router";
import { CheckoutReturnPage } from "~/pages/checkout";
import { pageHead } from "~/shared/lib/seo";

/** Robokassa's SuccessURL and FailURL: the status comes from the API only. */
export const Route = createFileRoute("/subscribe_/return")({
  validateSearch: (search: Record<string, unknown>): { payment?: string } =>
    typeof search.payment === "string" ? { payment: search.payment } : {},
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
