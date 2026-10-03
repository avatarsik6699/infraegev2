import type { CourseProgressTypes } from "~/entities/course";

export namespace AccountOverviewTypes {
  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    topicSummary: readonly CourseProgressTypes.Lesson[] | null;
  };
}
