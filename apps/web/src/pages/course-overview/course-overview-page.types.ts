import type { CourseTypes, CourseProgressTypes } from "~/entities/course";

export namespace CourseOverviewPageTypes {
  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    course: CourseTypes.Definition;
    lessons: readonly CourseTypes.LessonDefinition[];
  };
}
