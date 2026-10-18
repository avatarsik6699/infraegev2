import type { AccessTypes } from "~/entities/access";
import type { BillingTypes } from "~/entities/billing";
import type { LessonContent, ResolvedSubtopic } from "~/entities/lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace TopicLessonPageTypes {
  export type Data = {
    lesson: LessonContent.Definition;
    practiceUnavailable?: boolean;
    tasks: readonly PracticeTaskTypes.Task[];
    /** Change 192: paid tasks of the topic the visitor cannot open yet. */
    lockedTasks?: readonly PracticeTaskTypes.LockedTask[];
    /** Change 192: the visitor's access; it decides tree locks and the paywall. */
    access?: AccessTypes.State;
    /** Plans and prices, loaded only when this page shows the paywall. */
    offer?: BillingTypes.Offer;
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
