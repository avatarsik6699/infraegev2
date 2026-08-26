export namespace PracticeTaskTypes {
  export type TheoryLink = { hash: string; label: string };

  export type SolutionBlock =
    | { type: "text"; text: string }
    | { type: "callout"; tone: "idea" | "warning"; text: string }
    | { type: "steps"; prompt: string; steps: readonly string[] }
    | {
        type: "code";
        code: string;
        language: "python" | "text";
        caption?: string;
      };

  export type Task = {
    id: string;
    difficultyLabel: string;
    title: string;
    statement: string;
    hint: string;
    theoryLinks: readonly TheoryLink[];
    solution: readonly SolutionBlock[];
  };

  export type LocalTask = Task & {
    answers: readonly string[];
    explanation: string;
  };

  export type CheckResult = { correct: boolean; explanation: string };
  export type Checker = (
    taskId: string,
    answer: string,
  ) => Promise<CheckResult>;
}
