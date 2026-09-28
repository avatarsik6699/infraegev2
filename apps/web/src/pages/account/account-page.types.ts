import type { CourseProgressTypes } from "~/entities/course";
import { type Provider } from "~/features/account";
import { type MailPurpose } from "./model/mail-cooldown";

export namespace AccountPageTypes {
  export type Mode =
    "sign-in" | "register" | "verify" | "recovery" | "new-password" | "profile";
  export type Props = {
    mode: Mode;
    returnTo?: string;
    token?: string;
    practiceSummary?: readonly CourseProgressTypes.Lesson[] | null;
    enabledProviders?: readonly Provider[];
  };
  export type DeliveryPurpose = MailPurpose;
}
