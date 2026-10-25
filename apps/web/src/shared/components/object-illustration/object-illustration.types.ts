export namespace ObjectIllustrationTypes {
  /** Courses that have a scene in `public/images/courses`. */
  export type Course =
    "python" | "excel" | "algorithms-data-structures" | "advanced-problems";

  /**
   * Baked object illustration (no mascot): an EGE topic by its first task
   * number, or a course scene: the architect's coloured picture for the
   * home course card, the `/courses` card and the course head (Change 185,
   * WebP in three widths, `sizes` as laid out). `priority` marks the one
   * picture above the fold that is the page's largest paint (Change 218).
   */
  export type Props = (
    | { topic: number; course?: never; sizes?: never; priority?: never }
    | { course: Course; sizes?: string; priority?: boolean; topic?: never }
  ) & {
    className?: string;
  };
}
