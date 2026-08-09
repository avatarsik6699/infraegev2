import type { CourseLesson, ResolvedContentLink, Task } from "~/entities/content";

export namespace LessonPageTypes {
  export type Props = {
    lesson: CourseLesson;
    tasks: Task[];
    unlocks: ResolvedContentLink[];
  };
}
