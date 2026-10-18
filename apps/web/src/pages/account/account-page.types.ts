import type { CourseProgressTypes } from "~/entities/course";
import { type Provider } from "~/features/account";
import type { AccountProfileTypes } from "./account-profile.types";
import { type MailPurpose } from "./model/mail-cooldown";

export namespace AccountPageTypes {
  export type Mode =
    "sign-in" | "register" | "verify" | "recovery" | "new-password" | "profile";
  export type Props = {
    mode: Mode;
    returnTo?: string;
    token?: string;
    practiceSummary?: readonly CourseProgressTypes.Lesson[] | null;
    topicSummary?: readonly CourseProgressTypes.Lesson[] | null;
    enabledProviders?: readonly Provider[];
    /** Change 192: the «Доступ» tab, shown while selling is on. */
    billing?: AccountProfileTypes.Billing;
    /** The profile tab to open first. */
    tab?: AccountProfileTypes.Tab;
  };
  export type DeliveryPurpose = MailPurpose;
}
