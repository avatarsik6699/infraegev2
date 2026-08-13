import type { LessonTypes } from "~/entities/lesson";
import type { LessonProgressTypes } from "~/features/lesson-progress";

export namespace LessonPracticeTypes {
  export type Props = {
    tasks: readonly LessonTypes.PracticeTask[];
    progressStore: LessonProgressTypes.Store;
  };

  export type State = "idle" | "incorrect" | "correct";
  export type States = Partial<Record<string, State>>;
}
