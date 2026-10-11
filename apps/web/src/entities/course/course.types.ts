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

  export type LessonDefinition = {
    id: string;
    routeSlug: string;
    title: string;
    summary: string;
    masteryThreshold?: number;
    level?: Level;
    learningOutcomes: readonly string[];
    theory: readonly ConceptBlock[];
    /** The lesson's single formative, think-then-reveal self-check, rendered inside `result`
     *  («Итоги»), after the result copy — not counted toward masteryThreshold. */
    checkpoint?: readonly CheckpointItem[];
    result: React.ReactNode;
    status: Status;
    accessTier: AccessTier;
  };
}
