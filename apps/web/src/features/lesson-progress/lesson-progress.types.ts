export namespace LessonProgressTypes {
  export type Snapshot = {
    solvedTaskIds: readonly string[];
    acceptedAnswers: Readonly<Record<string, string>>;
  };

  export type Model = Snapshot & {
    clear: () => void;
    markSolved: (taskId: string, acceptedAnswer: string) => Snapshot;
  };

  export type Props = {
    solved: number;
    total: number;
    masteryThreshold: number;
    headingOrder?: 2 | 3 | 4 | 5 | 6;
    headingId?: string;
  };

  export type ProviderProps = {
    children: React.ReactNode;
  };
}
