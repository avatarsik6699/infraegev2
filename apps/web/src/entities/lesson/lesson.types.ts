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
    answers: readonly string[];
    hint: string;
    explanation: string;
    theoryLinks: readonly TheoryLink[];
  };
}
