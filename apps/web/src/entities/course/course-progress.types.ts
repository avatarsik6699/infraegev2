export namespace CourseProgressTypes {
  export type Lesson = {
    id: string;
    tasks: readonly { id: string; solutionRevision: number }[];
    masteryThreshold?: number;
    /** Additional lessons are practised but stay out of course mastery (Change 175). */
    level?: "core" | "advanced";
  };

  export type LessonProgress = {
    solvedTaskIds: readonly string[];
  };

  export type Snapshot = {
    masteredLessonIds: readonly string[];
    availableCount: number;
    allAvailableMastered: boolean;
  };

  export type Practice = {
    solved: number;
    total: number;
    mastered: boolean;
  };

  export type PracticeSnapshot = {
    byLessonId: Readonly<Record<string, Practice>>;
    solved: number;
    total: number;
  };
}
