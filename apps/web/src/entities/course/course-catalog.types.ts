export namespace CourseCatalogTypes {
  export type Id =
    "python" | "excel" | "algorithms-data-structures" | "advanced-problems";

  export type Definition = {
    id: Id;
    title: string;
    summary: string;
    level?: string;
    outcome?: string;
  };

  export type PlannedEntry = Definition & {
    status: "planned";
  };

  export type PublishedEntry = Definition & {
    status: "published";
    routeSlug: string;
    lessonCount: number;
  };

  export type Entry = PlannedEntry | PublishedEntry;
}
