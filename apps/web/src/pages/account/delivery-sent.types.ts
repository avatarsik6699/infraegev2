import type { AccountPageTypes } from "./account-page.types";

export namespace DeliverySentTypes {
  export type Props = {
    purpose: AccountPageTypes.DeliveryPurpose;
    email: string;
    pending: boolean;
    onResend: () => Promise<boolean>;
    onChangeEmail: () => void;
  };
}
