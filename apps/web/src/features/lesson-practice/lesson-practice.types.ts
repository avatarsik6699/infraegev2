import type { LessonTypes } from "~/entities/lesson";
import type { LessonProgressTypes } from "~/features/lesson-progress";

export namespace LessonPracticeTypes {
  export type Props = {
    tasks: readonly LessonTypes.PracticeTask[];
    progressStore: LessonProgressTypes.Store;
    checkAnswer: LessonTypes.PracticeChecker;
    onAnswerChecked?: (result: "correct" | "incorrect") => void;
  };

  export type State = "idle" | "checking" | "incorrect" | "correct" | "error";
  export type States = Partial<Record<string, State>>;
  export type Feedback = Partial<Record<string, string>>;
}
