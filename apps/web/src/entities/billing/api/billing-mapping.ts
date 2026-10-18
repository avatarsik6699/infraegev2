import type { components } from "~/shared/api/schema";
import type { BillingTypes } from "../billing.types";

const planIds = new Set<string>(["month", "year"]);
const statuses = new Set<string>([
  "created",
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export function toOffer(
  view: components["schemas"]["OfferView"],
): BillingTypes.Offer {
  return {
    billing: view.billing,
    paywall: view.paywall,
    offerVersion: view.offer_version,
    plans: view.plans
      .filter((plan) => planIds.has(plan.id))
      .map((plan) => ({
        id: plan.id,
        title: plan.title,
        priceKopecks: plan.price_kopecks,
        days: plan.days,
        monthlyEquivalentKopecks: plan.monthly_equivalent_kopecks,
        monthsPriceKopecks: plan.months_price_kopecks,
      })),
  };
}

export function toPayment(
  view: components["schemas"]["PaymentView"],
): BillingTypes.Payment {
  return {
    id: view.id,
    plan: view.plan === "year" ? "year" : "month",
    amountKopecks: view.amount_kopecks,
    status: statuses.has(view.status) ? view.status : "failed",
    createdAt: view.created_at,
    paidAt: view.paid_at ?? null,
    accessFrom: view.access_from ?? null,
    accessUntil: view.access_until ?? null,
    receiptUrl: view.receipt_url ?? null,
    returnPath: view.return_path ?? null,
  };
}
