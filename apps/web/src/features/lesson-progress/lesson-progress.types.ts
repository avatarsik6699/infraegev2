export namespace LessonProgressTypes {
  export type Snapshot = {
    solvedTaskIds: readonly string[];
  };

  export type Store = {
    clear: () => void;
    getServerSnapshot: () => Snapshot;
    getSnapshot: () => Snapshot;
    markSolved: (taskId: string) => void;
    subscribe: (listener: () => void) => () => void;
  };

  export type Props = {
    solved: number;
    total: number;
    masteryThreshold: number;
  };

  export type StoreOptions = {
    lessonId: string;
  };
}
