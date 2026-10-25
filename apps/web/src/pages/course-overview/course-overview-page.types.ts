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
    /** Additional lesson: marked, outside course mastery (Change 175). */
    advanced?: boolean;
    /** F10: false only when the lesson is known to have no practice tasks. */
    hasPractice: boolean;
    progress: Progress;
  };

  export type Module = {
    id: string;
    title: string;
    number: string;
    finalProject: boolean;
    /** F11: the «Дополнительно» module — its rows need no advanced mark. */
    advanced: boolean;
    status: string;
    lessons: readonly Lesson[];
    /** Mastered of published lessons; absent until progress is ready. */
    progress?: { mastered: number; total: number };
  };

  export type Action = {
    lesson: CourseTypes.LessonOutline;
    label: string;
    continuing: boolean;
  };

  export type Model = {
    modules: readonly Module[];
    lessonCount: number;
    /** Mastered published lessons; absent until progress is ready. */
    masteredLessons?: number;
    level?: string;
    action?: Action;
    progress: Progress;
  };

  export type Props = {
    practiceSummary: readonly CourseProgressTypes.Lesson[] | null;
    course: CourseTypes.Definition;
    lessons: readonly CourseTypes.LessonOutline[];
  };
}
