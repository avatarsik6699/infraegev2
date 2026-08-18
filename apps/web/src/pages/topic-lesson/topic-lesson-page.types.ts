import type { LessonContent, LessonTypes } from "~/entities/lesson";

export namespace TopicLessonPageTypes {
  export type Props = {
    lesson: LessonContent.Definition;
    tasks: readonly LessonTypes.PracticeTask[];
  };
}
