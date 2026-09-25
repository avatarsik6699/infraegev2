export namespace LessonProgressTypes {
  export type Snapshot = {
    outdatedTaskIds?: readonly string[];
    solvedRevisions?: Readonly<Record<string, Readonly<Record<string, true>>>>;
    solvedTaskIds: readonly string[];
  };

  export type Model = Snapshot & {
    clear: () => void;
    markSolved: (taskId: string, solutionRevision?: number) => Snapshot;
  };

  export type Props = {
    hideEmptyStatus?: boolean;
    solved: number;
    total: number;
    masteryThreshold: number;
    headingOrder?: 2 | 3 | 4 | 5 | 6;
    headingId?: string;
  };

  export type ProviderProps = {
    children: React.ReactNode;
    accountId?: string;
  };
}
