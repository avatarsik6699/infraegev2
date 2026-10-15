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
  };
}
