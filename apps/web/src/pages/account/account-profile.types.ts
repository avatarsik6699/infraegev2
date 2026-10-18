import type { AccessTypes } from "~/entities/access";
import type { CourseProgressTypes } from "~/entities/course";
import { type Provider } from "~/features/account";

export namespace AccountProfileTypes {
  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    topicSummary: readonly CourseProgressTypes.Lesson[] | null;
    enabledProviders: readonly Provider[];
    billing?: Billing;
    tab?: Tab;
  };

  export type Tab = "overview" | "access" | "settings";

  /** Change 192: selling is on; the visitor's access as SSR learned it. */
  export type Billing = {
    access: AccessTypes.State | undefined;
  };
}
