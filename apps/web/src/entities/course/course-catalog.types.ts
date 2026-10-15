export namespace CourseCatalogTypes {
  export type Id =
    "python" | "excel" | "algorithms-data-structures" | "advanced-problems";

  export type Definition = {
    id: Id;
    title: string;
    summary: string;
    /** The planned level for courses that are not published yet. */
    level?: string;
  };

  export type PlannedEntry = Definition & {
    status: "planned";
  };

  export type PublishedEntry = Definition & {
    status: "published";
    routeSlug: string;
    lessonCount: number;
    /** Modules of the published course (home course card, Change 185). */
    moduleCount: number;
    /** Additional lessons: listed, but outside course mastery (Change 175). */
    advancedLessonIds: readonly string[];
  };

  export type Entry = PlannedEntry | PublishedEntry;
}
