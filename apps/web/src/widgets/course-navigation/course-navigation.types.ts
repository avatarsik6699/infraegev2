export namespace CourseNavigationTypes {
  export type Lesson = {
    id: string;
    title: string;
    /** Absent for a lesson that is not published yet. */
    routeSlug?: string;
    /** Additional lessons are marked and stay out of course mastery (Change 175). */
    level?: "core" | "advanced";
    /** Change 192: the lesson is paid. */
    paid?: boolean;
  };

  export type Module = {
    id: string;
    title: string;
    lessons: readonly Lesson[];
  };

  export type Props = {
    courseId: string;
    courseRouteSlug: string;
    courseTitle: string;
    /** «Python», «Excel»: names the course in the phone disclosure (F15). */
    courseShortTitle: string;
    modules: readonly Module[];
    currentLessonId: string;
    /** Lessons shown with the green mastered check (F26). */
    masteredLessonIds?: ReadonlySet<string>;
    /** Lesson progress shown under the tree on narrow screens (F38). */
    progress?: React.ReactNode;
    /** Change 192: lock the paid lessons (the paywall is on, access is not granted). */
    locks?: boolean;
  };
}
