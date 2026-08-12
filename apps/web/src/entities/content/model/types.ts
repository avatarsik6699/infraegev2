// Content-as-code schema — mirrors docs/SPEC.md §3.
// Content lives as JSON files under content/{topics,courses,tasks}/, not in a database.

export type ContentStatus = "draft" | "review" | "published";
export type AccessTier = "free" | "paid";
export type CheckerType = "exact_match" | "numeric_tolerance";
export type InteractionType = "production" | "recognition";
export type LearningSectionRole = "idea" | "theory" | "algorithm" | "pitfalls";

export type DiagramElement = {
  kind: "node" | "edge" | "arrow" | "label" | "highlight";
  id: string;
  // Node/label position (ignored for edge/arrow, which reference from/to node ids).
  x?: number;
  y?: number;
  from?: string;
  to?: string;
  text?: string;
  /** Marks this element as the one the adjacent text is currently talking about (Mayer signalling). */
  highlighted?: boolean;
};

export type DiagramBlockData = {
  kind: "graph" | "automaton";
  /** Text alternative for the whole diagram — required for a11y (SPEC.md §8). */
  ariaLabel: string;
  elements: DiagramElement[];
};

export type TableDiagramBlockData = {
  kind: "bit-grid";
  ariaLabel: string;
  headers: string[];
  rows: string[][];
  /** Cell coordinates ("row,col") to visually highlight. */
  highlightedCells?: string[];
};

export type TextBlockData = {
  markdown: string;
};

export type FigureBlockData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type CodeExampleBlockData = {
  language: string;
  code: string;
  caption?: string;
};

export type CalloutBlockData = {
  // Author-written asides inside section blocks. The auto-derived "эта тема легче даётся, если
  // понимать X → перейти" navigation widget is a separate component driven by Topic.prerequisites/
  // related_topics/unlocks_topics (SPEC.md §5.2's PrerequisiteCallout), not this block type.
  tone: "info" | "warning";
  markdown: string;
};

export type VideoEmbedBlockData = {
  url: string;
  title: string;
};

/** worked_example / completion_exercise / productive_failure_prompt share the same shape. */
export type WorkedExampleBlockData = {
  prompt: string;
  steps: string[];
};

export type WorkedExampleBlockType =
  "worked_example" | "completion_exercise" | "productive_failure_prompt";

/** Discriminated union: `type` determines the exact shape of `data` at every consumer. */
export type ContentBlock =
  | { type: "text"; data: TextBlockData }
  | { type: "figure"; data: FigureBlockData }
  | { type: "diagram"; data: DiagramBlockData | TableDiagramBlockData }
  | { type: "code_example"; data: CodeExampleBlockData }
  | { type: WorkedExampleBlockType; data: WorkedExampleBlockData }
  | { type: "callout"; data: CalloutBlockData }
  | { type: "video_embed"; data: VideoEmbedBlockData };

export type ContentBlockType = ContentBlock["type"];
export type ContentBlockData = ContentBlock["data"];

export type LearningSection = {
  id: string;
  role: LearningSectionRole;
  title: string;
  nav_label?: string;
  blocks: ContentBlock[];
};

export type Topic = {
  id: string;
  task_numbers: number[];
  title: string;
  summary: string;
  sections: LearningSection[];
  quick_reference_blocks: ContentBlock[];
  learning_outcomes: string[];
  prerequisites: string[];
  mastery_threshold: number;
  related_topics: string[];
  practice_task_ids: string[];
  status: ContentStatus;
  access_tier: AccessTier;
};

export type CourseLesson = {
  id: string;
  course_id: string;
  title: string;
  sections: LearningSection[];
  quick_reference_blocks: ContentBlock[];
  learning_outcomes: string[];
  unlocks_topics: string[];
  practice_task_ids: string[];
  status: ContentStatus;
};

export type Course = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type Task = {
  id: string;
  topic_ids: string[];
  statement: string;
  checker_type: CheckerType;
  answer_variants: string[];
  numeric_tolerance?: number;
  interaction_type: InteractionType;
  explanation: ContentBlock[];
  difficulty: 1 | 2 | 3;
  is_interleaving_eligible: boolean;
};
