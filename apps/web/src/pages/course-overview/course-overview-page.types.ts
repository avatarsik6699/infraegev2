import type { CourseTypes } from "~/entities/course";

export namespace CourseOverviewPageTypes {
  export type Props = {
    course: CourseTypes.Definition;
    lessons: readonly CourseTypes.LessonDefinition[];
  };
}
