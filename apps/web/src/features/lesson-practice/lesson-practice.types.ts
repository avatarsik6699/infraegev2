import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace LessonPracticeTypes {
  export type Props = {
    tasks: readonly PracticeTaskTypes.Task[];
    solvedTaskIds: readonly string[];
    acceptedAnswers: Readonly<Record<string, string>>;
    onTaskSolved: (taskId: string, acceptedAnswer: string) => number;
    checkAnswer: PracticeTaskTypes.Checker;
    onAnswerChecked?: (event: AnswerCheckedEvent) => void;
  };

  export type AnswerCheckedEvent = {
    result: "correct" | "incorrect";
    solvedCount: number;
  };

  export type State = "idle" | "checking" | "incorrect" | "correct" | "error";
  export type States = Partial<Record<string, State>>;
  export type Feedback = Partial<Record<string, string>>;
}
