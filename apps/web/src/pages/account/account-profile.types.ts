import type { CourseProgressTypes } from "~/entities/course";
import { type Provider } from "~/features/account";

export namespace AccountProfileTypes {
  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    enabledProviders: readonly Provider[];
  };
}
