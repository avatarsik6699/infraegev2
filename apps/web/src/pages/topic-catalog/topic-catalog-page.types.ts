export namespace TopicCatalogPageTypes {
  export type Filter = "all" | "started" | "not-started";
  export type Summary = readonly {
    id: string;
    tasks: readonly { id: string; solutionRevision: number }[];
  }[];
  export type Progress = { solved: number; total: number };
  export type LoadState = "loading" | "ready" | "error";
}
