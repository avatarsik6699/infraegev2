export namespace CourseTypes {
  export type Status = "draft" | "review" | "published";
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

  export type LessonPlanItem = {
    id: string;
    title: string;
    outcome: string;
  };

  export type Definition = {
    id: string;
    routeSlug: string;
    title: string;
    summary: string;
    audience: string;
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
    learningOutcomes: readonly string[];
    practiceTaskIds: readonly string[];
    theory: readonly ConceptBlock[];
    /** The lesson's single formative, think-then-reveal self-check, rendered inside `result`
     *  («Итоги»), after the result copy — not counted toward masteryThreshold. */
    checkpoint?: readonly CheckpointItem[];
    result: React.ReactNode;
    status: Status;
    accessTier: AccessTier;
  };
}
