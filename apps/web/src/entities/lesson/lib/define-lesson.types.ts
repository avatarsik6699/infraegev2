// TSX-as-content authoring contract (docs/SPEC.md §3).
export namespace LessonContent {
  export type Status = "draft" | "review" | "published";
  export type AccessTier = "free" | "paid";

  export type CheckpointItem = {
    id: string;
    prompt: React.ReactNode;
    reveal: React.ReactNode;
  };

  export type ConceptBlock = {
    id: string;
    navLabel: string;
    /** Prose only — must not restate what an adjacent diagram already shows (redundancy principle). */
    explanation: React.ReactNode;
    /** Only when the explanation needs ≥3 interrelated values held in mind at once (split-attention). */
    diagram?: React.ReactNode;
    /** Precedes any independent attempt at the idea (worked-example effect). */
    workedExample?: React.ReactNode;
    /** Sits next to the concept it belongs to, not in a trailing list (signalling principle). */
    mistake?: React.ReactNode;
  };

  export type Definition = {
    id: string;
    /** Public path segment: /ege/{routeSlug}. */
    routeSlug: string;
    taskNumber: number;
    title: string;
    summary: string;
    /** Share of correct Task answers counted as "mastered". Defaults to 0.8. */
    masteryThreshold?: number;
    learningOutcomes: readonly string[];
    /** References content/tasks/**. */
    practiceTaskIds: readonly string[];
    theory: readonly ConceptBlock[];
    examFocus?: React.ReactNode;
    /** Formative, think-then-reveal self-check — not counted toward masteryThreshold. */
    checkpoint?: readonly CheckpointItem[];
    result: React.ReactNode;
    status: Status;
    /** Monetization groundwork — not enforced on the MVP. */
    accessTier: AccessTier;
  };
}
