import type { CourseTypes } from "~/entities/course";
import type { PracticeTaskTypes } from "~/entities/practice-task";

export namespace CourseLessonPageTypes {
  export type Props = {
    course: CourseTypes.Definition;
    lesson: CourseTypes.LessonDefinition;
    tasks: readonly PracticeTaskTypes.Task[];
  };
}
