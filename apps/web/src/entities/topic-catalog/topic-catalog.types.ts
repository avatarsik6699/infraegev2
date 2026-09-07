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
  };

  export type Entry = PlannedEntry | PublishedEntry;
}
