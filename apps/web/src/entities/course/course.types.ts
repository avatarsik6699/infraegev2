export namespace CourseTypes {
  export type Status = "draft" | "published";
  export type AccessTier = "free" | "paid";
  export type Stage = "early_access" | "complete";

  export type CheckpointItem = {
    id: string;
    prompt: React.ReactNode;
    reveal: React.ReactNode;
  };

  export type ConceptBlock = {
    id: string;
    navLabel: string;
    /**
     * The lesson's opening paragraphs (Change 175): shown under the lesson
     * heading without a heading of their own and left out of «На этой
     * странице»; `navLabel` stays for theory links.
     */
    lead?: boolean;
    explanation: React.ReactNode;
    diagram?: React.ReactNode;
    workedExample?: React.ReactNode;
    mistake?: React.ReactNode;
  };

  export type Module = {
    id: string;
    title: string;
    summary: string;
    lessonPlan: readonly LessonPlanItem[];
  };

  /** Additional lessons go last, are marked and stay out of course mastery (SPEC §1.4). */
  export type Level = "core" | "advanced";
  export type LessonPlanItem = {
    id: string;
    title: string;
    outcome: string;
    level?: Level;
  };

  export type Definition = {
    id: string;
    routeSlug: string;
    title: string;
    /** «Python», «Excel»: the course in a label beside a module (practice topics). */
    shortTitle: string;
    summary: string;
    audience: string;
    /** «Что понадобится» on the course overview: the program and the files. */
    requirements: string;
    learningOutcomes: readonly string[];
    status: Status;
    stage: Stage;
    modules: readonly Module[];
  };

  /** A theory section's anchor and heading: public even when its text is paid. */
  export type ConceptOutline = { id: string; navLabel: string; lead?: boolean };

  /** The default export of `<lesson>.paid.lesson.tsx` (Change 192, SPEC §6.1). */
  export type PaidLessonContent = {
    theory: readonly ConceptBlock[];
    checkpoint?: readonly CheckpointItem[];
    result: React.ReactNode;
  };

  /** A paid lesson keeps its outline and opening public; its text loads on demand. */
  export type PaidLesson = {
    outline: readonly [ConceptOutline, ...ConceptOutline[]];
    /** The first paragraph of the lesson's opening, shown above the paywall. */
    preview: React.ReactNode;
    /** Self-check questions in the paid module; 0 when it has none. */
    selfCheck: number;
    load: () => Promise<{ default: PaidLessonContent }>;
  };

  /**
   * Change 222: a course lesson without its content, generated from the lesson module by
   * `scripts/practice-registry.mjs`; `load` imports the module on demand.
   */
  export type LessonOutline = {
    id: string;
    routeSlug: string;
    title: string;
    summary: string;
    status: Status;
    accessTier: AccessTier;
    /** Present for a paid lesson: the count of its self-check questions. */
    paid?: { selfCheck: number };
    level?: Level;
    masteryThreshold?: number;
    load: () => Promise<LessonDefinition>;
  };

  export type LessonDefinition = {
    id: string;
    routeSlug: string;
    title: string;
    summary: string;
    masteryThreshold?: number;
    level?: Level;
    learningOutcomes: readonly string[];
    /** Free lessons only; a paid lesson's theory, checkpoint and result are in `paid`. */
    theory?: readonly ConceptBlock[];
    /** The lesson's single formative, think-then-reveal self-check: its own section after
     *  «Итог» and before «Практика» (Change 197) — not counted toward masteryThreshold. */
    checkpoint?: readonly CheckpointItem[];
    result?: React.ReactNode;
    paid?: PaidLesson;
    status: Status;
    accessTier: AccessTier;
  };
}
