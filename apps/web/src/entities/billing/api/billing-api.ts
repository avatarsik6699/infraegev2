import { apiClient, ApiError } from "~/shared/api";
import type { BillingTypes } from "../billing.types";
import { toPayment } from "./billing-mapping";

/** Why a checkout was refused, as the page explains it. */
export type CheckoutFailure =
  "offer_outdated" | "checkout_paused" | "signed_out" | "unavailable";

export class CheckoutError extends Error {
  readonly code: CheckoutFailure;
  constructor(code: CheckoutFailure) {
    super(`Checkout refused: ${code}`);
    this.name = "CheckoutError";
    this.code = code;
  }
}

/** Browser calls of the billing API (Change 192, SPEC §6.1); the session cookie
 *  goes with them, and every write carries the CSRF token. */
export const billingApi = {
  async checkout(input: {
    plan: BillingTypes.PlanId;
    offerVersion: string;
    returnPath: string | null;
    idempotencyKey: string;
    csrfToken: string | null;
  }): Promise<{ paymentId: string; redirectUrl: string }> {
    const result = await apiClient.POST("/api/billing/checkout", {
      body: {
        plan: input.plan,
        offer_version: input.offerVersion,
        return_path: input.returnPath,
        idempotency_key: input.idempotencyKey,
      },
      headers: { "x-csrf-token": input.csrfToken },
    });
    if (!result.data || !result.response.ok)
      throw new CheckoutError(failureOf(result.response.status, result.error));
    return {
      paymentId: result.data.payment_id,
      redirectUrl: result.data.redirect_url,
    };
  },

  async payment(id: string): Promise<BillingTypes.Payment> {
    const result = await apiClient.GET("/api/billing/payments/{payment_id}", {
      params: { path: { payment_id: id } },
      cache: "no-store",
    });
    if (!result.data || !result.response.ok)
      throw new ApiError("http", "Payment status failed", {
        status: result.response.status,
      });
    return toPayment(result.data);
  },

  async payments(): Promise<readonly BillingTypes.Payment[]> {
    const result = await apiClient.GET("/api/billing/payments", {
      cache: "no-store",
    });
    if (!result.data || !result.response.ok)
      throw new ApiError("http", "Payment history failed", {
        status: result.response.status,
      });
    return result.data.payments.map(toPayment);
  },
};

function failureOf(status: number, error: unknown): CheckoutFailure {
  if (status === 401 || status === 403) return "signed_out";
  const detail =
    error && typeof error === "object" && "detail" in error
      ? error.detail
      : undefined;
  return detail === "offer_outdated" || detail === "checkout_paused"
    ? detail
    : "unavailable";
}
