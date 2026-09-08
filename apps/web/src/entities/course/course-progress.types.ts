export namespace CourseProgressTypes {
  export type Lesson = {
    id: string;
    practiceTaskIds: readonly string[];
    masteryThreshold?: number;
  };

  export type LessonProgress = {
    solvedTaskIds: readonly string[];
  };

  export type Snapshot = {
    masteredLessonIds: readonly string[];
    availableCount: number;
    allAvailableMastered: boolean;
  };
}
