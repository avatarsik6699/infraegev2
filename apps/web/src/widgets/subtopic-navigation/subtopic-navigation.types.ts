export namespace SubtopicNavigationTypes {
  export type Item = {
    slug: string;
    title: string;
    level: "core" | "advanced";
    /** Tasks of the subtopic; only the current topic marks solved ones. */
    taskIds: readonly string[];
    /** Change 192: the subtopic is paid. */
    paid?: boolean;
  };

  export type Topic = {
    id: string;
    routeSlug: string;
    title: string;
    /** «16» or «19–21», already formatted. */
    number: string;
    subtopics: readonly Item[];
    /** Change 192: «Практика и итог» is paid. */
    paidPractice?: boolean;
  };

  export type Props = {
    /** Published topics in exam order; the current one opens. */
    topics: readonly Topic[];
    lessonId: string;
    /** Subtopic slug, or `practice` on the final page. */
    current: string;
    tasks: readonly {
      id: string;
      solutionRevision?: number;
      countsTowardMastery?: boolean;
    }[];
    practiceUnavailable?: boolean;
    /** Lesson progress shown under the tree on narrow screens (F38). */
    progress?: React.ReactNode;
    /** Change 192: lock the paid files (the paywall is on, access is not granted). */
    locks?: boolean;
  };
}
