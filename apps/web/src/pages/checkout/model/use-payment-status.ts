import { useEffect, useState } from "react";
import { billingApi, type BillingTypes } from "~/entities/billing";

const POLL_MS = 2000;
const GIVE_UP_MS = 90_000;

export type PaymentWatch =
  | { state: "checking"; payment?: BillingTypes.Payment }
  | { state: "slow"; payment?: BillingTypes.Payment }
  | { state: "done"; payment: BillingTypes.Payment }
  | { state: "error" };

/**
 * Change 192: the provider brings the buyer back before or after its
 * notification; the page asks the API (owner only, never the query string)
 * until the payment settles, then stops. After 90 s it says it is slow.
 */
export function usePaymentStatus(paymentId: string | undefined): PaymentWatch {
  const [watch, setWatch] = useState<PaymentWatch>(
    paymentId ? { state: "checking" } : { state: "error" },
  );
  useEffect(
    function pollPaymentFx() {
      if (!paymentId) return;
      let stopped = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const started = Date.now();
      const tick = async () => {
        try {
          const payment = await billingApi.payment(paymentId);
          if (stopped) return;
          if (payment.status !== "created" && payment.status !== "pending") {
            setWatch({ state: "done", payment });
            return;
          }
          const slow = Date.now() - started > GIVE_UP_MS;
          setWatch({ state: slow ? "slow" : "checking", payment });
          if (!slow) timer = setTimeout(() => void tick(), POLL_MS);
        } catch {
          if (!stopped) setWatch({ state: "error" });
        }
      };
      void tick();
      return () => {
        stopped = true;
        if (timer) clearTimeout(timer);
      };
    },
    [paymentId],
  );
  return watch;
}
