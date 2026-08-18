export namespace LessonTypes {
  export type OutlineItem = {
    id: string;
    label: string;
  };

  export type OutlineGroup = {
    id: string;
    label: string;
    items: OutlineItem[];
  };

  export type TheoryLink = {
    hash: string;
    label: string;
  };

  export type PracticeTask = {
    id: string;
    difficultyLabel: string;
    title: string;
    statement: string;
    hint: string;
    theoryLinks: readonly TheoryLink[];
  };

  export type LocalPracticeTask = PracticeTask & {
    answers: readonly string[];
    explanation: string;
  };

  export type CheckResult = {
    correct: boolean;
    explanation: string;
  };

  export type PracticeChecker = (
    taskId: string,
    answer: string,
  ) => Promise<CheckResult>;
}
