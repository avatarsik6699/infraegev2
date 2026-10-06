export namespace CourseNavigationTypes {
  export type Lesson = {
    id: string;
    title: string;
    /** Absent for a lesson that is not published yet. */
    routeSlug?: string;
  };

  export type Module = {
    id: string;
    title: string;
    lessons: readonly Lesson[];
  };

  export type Props = {
    courseRouteSlug: string;
    courseTitle: string;
    modules: readonly Module[];
    currentLessonId: string;
    /** Lesson progress shown under the tree on narrow screens (F38). */
    progress?: React.ReactNode;
  };
}
