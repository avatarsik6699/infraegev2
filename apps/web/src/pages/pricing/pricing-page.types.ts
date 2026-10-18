import type { AccessTypes } from "~/entities/access";
import type { BillingTypes } from "~/entities/billing";

export namespace PricingPageTypes {
  export type Props = {
    offer: BillingTypes.Offer;
    access: AccessTypes.State | undefined;
    /** The page the visitor came from; checkout returns there after payment. */
    from?: string;
  };
}
