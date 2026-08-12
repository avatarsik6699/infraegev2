import type { components } from "~/shared/api";

// Content-as-code schema — mirrors docs/SPEC.md §3.
// Content lives as JSON files under content/{topics,courses,tasks}/, not in a database.

export type ContentStatus = "draft" | "review" | "published";
export type AccessTier = "free" | "paid";
export type CheckerType = "exact_match" | "numeric_tolerance";
export type InteractionType = "production" | "recognition";
export type LearningSectionRole = "idea" | "theory" | "algorithm" | "pitfalls";

type ApiSchemas = components["schemas"];

export type DiagramElement = ApiSchemas["DiagramElement"];
export type DiagramBlockData = ApiSchemas["GraphDiagramData"];
export type TableDiagramBlockData = ApiSchemas["TableDiagramData"];
export type TextBlockData = ApiSchemas["TextBlockData"];
export type FigureBlockData = ApiSchemas["FigureBlockData"];
export type CodeExampleBlockData = ApiSchemas["CodeExampleBlockData"];
export type CalloutBlockData = ApiSchemas["CalloutBlockData"];
export type VideoEmbedBlockData = ApiSchemas["VideoEmbedBlockData"];
export type WorkedExampleBlockData = ApiSchemas["WorkedExampleBlockData"];

export type WorkedExampleBlockType =
  "worked_example" | "completion_exercise" | "productive_failure_prompt";

/** Discriminated union: `type` determines the exact shape of `data` at every consumer. */
export type ContentBlock =
  | ApiSchemas["TextBlock"]
  | ApiSchemas["FigureBlock"]
  | ApiSchemas["DiagramBlock"]
  | ApiSchemas["CodeExampleBlock"]
  | ApiSchemas["WorkedExampleBlock"]
  | ApiSchemas["CalloutBlock"]
  | ApiSchemas["VideoEmbedBlock"];

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
