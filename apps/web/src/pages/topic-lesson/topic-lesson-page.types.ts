import type { LessonContent, ResolvedSubtopic } from "~/entities/lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace TopicLessonPageTypes {
  export type Data = {
    lesson: LessonContent.Definition;
    practiceUnavailable?: boolean;
    tasks: readonly PracticeTaskTypes.Task[];
  };

  export type SubtopicProps = Data & { subtopic: ResolvedSubtopic };

  export type PracticeProps = Data;

  export type FrameProps = Data & {
    /** Subtopic slug, or `practice` on the final page. */
    current: string;
    outline: readonly { id: string; label: string }[];
    children: React.ReactNode;
  };
}
