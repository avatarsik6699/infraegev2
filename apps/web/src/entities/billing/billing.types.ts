export namespace BillingTypes {
  export type PlanId = "month" | "year";

  /** A one-time pass (SPEC §2.2): prices in kopecks, as the API sends them. */
  export type Plan = {
    id: PlanId;
    title: string;
    priceKopecks: number;
    days: number;
    /** The price spread over 30-day months: 249 ₽ for the year pass. */
    monthlyEquivalentKopecks: number;
    /** Twelve months at the month price: the honest crossed-out sum of the year. */
    monthsPriceKopecks: number;
  };

  /** The plans and the offer version a checkout must accept (Change 192). */
  export type Offer = {
    billing: boolean;
    paywall: boolean;
    offerVersion: string;
    plans: readonly Plan[];
  };

  export type PaymentStatus =
    "created" | "pending" | "succeeded" | "failed" | "refunded";

  export type Payment = {
    id: string;
    plan: PlanId;
    amountKopecks: number;
    status: PaymentStatus;
    createdAt: string;
    paidAt: string | null;
    accessFrom: string | null;
    accessUntil: string | null;
    receiptUrl: string | null;
    returnPath: string | null;
  };
}
