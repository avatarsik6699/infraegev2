import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace LessonPracticeTypes {
  export type Props = {
    outdatedTaskIds?: readonly string[];
    unavailable?: boolean;
    onRefresh?: () => Promise<unknown>;
    tasks: readonly PracticeTaskTypes.Task[];
    solvedTaskIds: readonly string[];
    acceptedAnswers: Readonly<Record<string, string>>;
    onTaskSolved: (taskId: string, acceptedAnswer: string) => number;
    checkAnswer: PracticeTaskTypes.Checker;
  };

  export type State =
    | "idle"
    | "checking"
    | "incorrect"
    | "correct"
    | "error"
    | "stale"
    | "unavailable";
  export type States = Partial<Record<string, State>>;
  export type Feedback = Partial<Record<string, string>>;
}
