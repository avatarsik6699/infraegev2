import type { AccessTypes } from "~/entities/access";
import type { BillingTypes } from "~/entities/billing";
import type { CourseProgressTypes, CourseTypes } from "~/entities/course";
import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace CourseLessonPageTypes {
  export type Props = {
    course: CourseTypes.Definition;
    lesson: CourseTypes.LessonDefinition;
    practiceUnavailable?: boolean;
    /** The course's practice summary for the rail's mastered checks (F26). */
    practiceSummary?: readonly CourseProgressTypes.Lesson[] | null;
    tasks: readonly PracticeTaskTypes.Task[];
    /** Change 192: paid tasks of the lesson the visitor cannot open yet. */
    lockedTasks?: readonly PracticeTaskTypes.LockedTask[];
    /** Change 192: the visitor's access; it decides tree locks and the paywall. */
    access?: AccessTypes.State;
    /** Plans and prices, loaded only when this page shows the paywall. */
    offer?: BillingTypes.Offer;
  };
}
