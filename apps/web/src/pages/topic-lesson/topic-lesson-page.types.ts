import type { LessonContent } from "~/entities/lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace TopicLessonPageTypes {
  export type Props = {
    lesson: LessonContent.Definition;
    tasks: readonly PracticeTaskTypes.Task[];
  };
}
