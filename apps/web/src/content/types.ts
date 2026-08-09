// Content-as-code schema — mirrors docs/SPEC.md §3.
// Content lives as JSON files under content/{topics,courses,tasks}/, not in a database.

export type ContentStatus = "draft" | "review" | "published";
export type AccessTier = "free" | "paid";
export type PresentationMode =
  "worked_example_first" | "productive_failure_first";
export type CheckerType = "exact_match" | "numeric_tolerance";
export type InteractionType = "production" | "recognition";

export type ContentBlockType =
  | "text"
  | "diagram"
  | "code_example"
  | "worked_example"
  | "completion_exercise"
  | "productive_failure_prompt"
  | "callout"
  | "video_embed";

export interface DiagramElement {
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
}

export interface DiagramBlockData {
  kind: "graph" | "automaton";
  /** Text alternative for the whole diagram — required for a11y (SPEC.md §8). */
  ariaLabel: string;
  elements: DiagramElement[];
}

export interface TableDiagramBlockData {
  kind: "bit-grid";
  ariaLabel: string;
  headers: string[];
  rows: string[][];
  /** Cell coordinates ("row,col") to visually highlight. */
  highlightedCells?: string[];
}

export interface TextBlockData {
  markdown: string;
}

export interface CodeExampleBlockData {
  language: string;
  code: string;
  caption?: string;
}

export interface CalloutBlockData {
  // Author-written asides inside content_blocks. The auto-derived "эта тема легче даётся, если
  // понимать X → перейти" navigation widget is a separate component driven by Topic.prerequisites/
  // related_topics/unlocks_topics (SPEC.md §5.2's PrerequisiteCallout), not this block type.
  tone: "info" | "warning";
  markdown: string;
}

export interface VideoEmbedBlockData {
  url: string;
  title: string;
}

/** worked_example / completion_exercise / productive_failure_prompt share the same shape. */
export interface WorkedExampleBlockData {
  prompt: string;
  steps: string[];
}

export type ContentBlockData =
  | TextBlockData
  | DiagramBlockData
  | TableDiagramBlockData
  | CodeExampleBlockData
  | CalloutBlockData
  | VideoEmbedBlockData
  | WorkedExampleBlockData;

export interface ContentBlock {
  type: ContentBlockType;
  data: ContentBlockData;
}

export interface Topic {
  id: string;
  task_numbers: number[];
  title: string;
  summary: string;
  content_blocks: ContentBlock[];
  prerequisites: string[];
  mastery_threshold: number;
  presentation_mode: PresentationMode;
  related_topics: string[];
  practice_task_ids: string[];
  status: ContentStatus;
  access_tier: AccessTier;
}

export interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  content_blocks: ContentBlock[];
  unlocks_topics: string[];
  practice_task_ids: string[];
  status: ContentStatus;
}

export interface Course {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Task {
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
}
