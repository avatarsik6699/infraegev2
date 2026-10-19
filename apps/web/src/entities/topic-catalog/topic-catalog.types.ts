export namespace TopicCatalogTypes {
  export type TaskNumbers = readonly [number, ...number[]];

  export type Definition = {
    id: string;
    taskNumbers: TaskNumbers;
    title: string;
    summary: string;
  };

  export type PlannedEntry = Definition & {
    status: "planned";
  };

  export type PublishedEntry = Definition & {
    status: "published";
    routeSlug: string;
    /** Subtopics of the published lesson (home topic cards, Change 185). */
    subtopicCount: number;
    /** Slug of the first subtopic: the page a topic link opens (Change 194). */
    firstSubtopic: string;
  };

  export type Entry = PlannedEntry | PublishedEntry;

  /** Exam difficulty level of a task (FIPI: Б, П, В). */
  export type Level = "basic" | "advanced" | "high";

  /** Target-score goal on `/ege` (Change 185, F35). */
  export type Goal = "base" | "standard" | "hard";

  export type GoalDefinition = {
    id: Goal;
    title: string;
    /** Test score the goal aims at, «40+». */
    target: number;
    levels: readonly Level[];
    /** What the goal asks of the student, in the architect's words. */
    summary: string;
  };
}
