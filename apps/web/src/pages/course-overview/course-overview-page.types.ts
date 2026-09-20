import type { CourseTypes, CourseProgressTypes } from "~/entities/course";

export namespace CourseOverviewPageTypes {
  export type Progress =
    | { status: "loading" }
    | { status: "unavailable" }
    | ({ status: "ready" } & CourseProgressTypes.Practice);

  export type Lesson = {
    id: string;
    title: string;
    number: string;
    routeSlug?: string;
    progress: Progress;
  };

  export type Module = {
    id: string;
    title: string;
    number: string;
    finalProject: boolean;
    status: string;
    lessons: readonly Lesson[];
  };

  export type Action = {
    lesson: CourseTypes.LessonDefinition;
    label: string;
    continuing: boolean;
  };

  export type Model = {
    modules: readonly Module[];
    lessonCount: number;
    level?: string;
    action?: Action;
    progress: Progress;
  };

  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    course: CourseTypes.Definition;
    lessons: readonly CourseTypes.LessonDefinition[];
  };
}
