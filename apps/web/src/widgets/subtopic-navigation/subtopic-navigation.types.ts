export namespace SubtopicNavigationTypes {
  export type Item = {
    slug: string;
    title: string;
    taskIds: readonly string[];
  };

  export type Props = {
    lessonId: string;
    routeSlug: string;
    title: string;
    /** «Задание 16», already formatted. */
    taskLabel: string;
    subtopics: readonly Item[];
    /** Subtopic slug, or `practice` on the final page. */
    current: string;
    tasks: readonly { id: string; solutionRevision?: number }[];
    practiceUnavailable?: boolean;
    /** Lesson progress block shown under the list. */
    progress?: React.ReactNode;
  };
}
