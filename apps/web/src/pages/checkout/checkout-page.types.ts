import type { AccessTypes } from "~/entities/access";
import type { BillingTypes } from "~/entities/billing";

export namespace CheckoutPageTypes {
  export type Props = {
    offer: BillingTypes.Offer;
    access: AccessTypes.State | undefined;
    plan: BillingTypes.PlanId;
    /** Where to return after payment; already checked by `safeReturnTo`. */
    from?: string;
  };
}
