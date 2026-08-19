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

  export type PracticeSolutionBlock =
    | { type: "text"; text: string }
    | { type: "callout"; tone: "idea" | "warning"; text: string }
    | {
        type: "steps";
        prompt: string;
        steps: readonly string[];
      }
    | {
        type: "code";
        code: string;
        language: "python" | "text";
        caption?: string;
      };

  export type PracticeTask = {
    id: string;
    difficultyLabel: string;
    title: string;
    statement: string;
    hint: string;
    theoryLinks: readonly TheoryLink[];
    solution: readonly PracticeSolutionBlock[];
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
