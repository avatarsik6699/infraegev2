// TSX-as-content authoring contract (docs/SPEC.md §3).
export namespace LessonContent {
  export type Status = "draft" | "published";
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

  /** A theory section's anchor and heading: public even when its text is paid. */
  export type ConceptOutline = { id: string; navLabel: string };

  /**
   * Change 192: paid text lives in its own `*.paid.*` module, imported on demand
   * so its chunk can be served only after an access check (SPEC §6.1).
   */
  export type PaidLoader<Content> = () => Promise<{ default: Content }>;

  /** The default export of `<lesson>.paid.<subtopic>.tsx`. */
  export type PaidSubtopicContent = {
    theory: readonly ConceptBlock[];
    checkpoint?: readonly CheckpointItem[];
  };

  /** The default export of `<lesson>.paid.praktika.tsx`. */
  export type PaidPracticeContent = {
    examFocus?: React.ReactNode;
    checkpoint?: readonly CheckpointItem[];
    result: React.ReactNode;
  };

  /** «Практика и итог» of a topic whose final page is paid. */
  export type PaidPractice = {
    /** Which optional sections the paid module has, for the page outline. */
    examFocus: boolean;
    /** Self-check questions of the paid module; 0 when it has none. */
    checkpoint: number;
    load: PaidLoader<PaidPracticeContent>;
  };

  /** The paid part of a subtopic: its outline and opening stay public. */
  export type PaidSubtopic = {
    /** Concept anchors and headings in authored order (`conceptIds` order). */
    outline: readonly [ConceptOutline, ...ConceptOutline[]];
    /** The opening paragraph of the first section, shown above the paywall. */
    preview: React.ReactNode;
    /** Self-check questions in the paid module; 0 when it has none. */
    selfCheck: number;
    load: PaidLoader<PaidSubtopicContent>;
  };

  /** Authored page of an EGE topic: adjacent theory blocks under one URL (Change 167). */
  export type Subtopic = {
    /** Public path segment: /ege/{routeSlug}/{slug}. */
    slug: string;
    title: string;
    /** F42: one or two sentences under the subtopic title, so a heading is
     * never followed straight by another heading. */
    lead?: string;
    /** Adjacent `ConceptBlock` ids in authored order. */
    conceptIds: readonly [string, ...string[]];
    /** Advanced subtopics cover rare exam cases: they follow all core ones and
     *  stay outside mastery (SPEC §1.4, Change 171). Defaults to `core`. */
    level?: SubtopicLevel;
    /** «Объясни, почему» self-check at the end of the subtopic page, after its
     *  tasks; not counted as practice. */
    checkpoint?: readonly CheckpointItem[];
    /** Change 192: a paid subtopic keeps its text in a separate module; its
     *  concepts are absent from `theory`. Defaults to free. */
    access?: AccessTier;
    paid?: PaidSubtopic;
  };

  export type SubtopicLevel = "core" | "advanced";

  export type Definition = {
    id: string;
    /** Public path segment: /ege/{routeSlug}. */
    routeSlug: string;
    /** One or more EGE task numbers covered by this learning topic. */
    taskNumbers: readonly [number, ...number[]];
    title: string;
    summary: string;
    /** Share of correct Task answers counted as "mastered". Defaults to 0.8. */
    masteryThreshold?: number;
    learningOutcomes: readonly string[];
    /** Authored theory blocks of the free subtopics; task membership belongs to the
     *  canonical practice bank. Paid subtopics carry their own (`Subtopic.paid`). */
    theory: readonly ConceptBlock[];
    /** Splits the theory into subtopic pages without changing its order; required once published. */
    subtopics?: readonly Subtopic[];
    examFocus?: React.ReactNode;
    /** The lesson's single formative, think-then-reveal self-check, rendered inside `result`
     *  («Итоги»), after the result copy — not counted toward masteryThreshold. */
    checkpoint?: readonly CheckpointItem[];
    /** Present when «Практика и итог» is free; a paid final page has `paidPractice`. */
    result?: React.ReactNode;
    paidPractice?: PaidPractice;
    status: Status;
    /** Change 192: `paid` when any part of the topic is paid (SPEC §2.2). */
    accessTier: AccessTier;
  };
}
