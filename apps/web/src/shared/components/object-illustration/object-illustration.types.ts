export namespace ObjectIllustrationTypes {
  /** Courses that have a picture in `public/images/courses`. */
  export type Course = "python";

  /**
   * Baked object illustration (no mascot): an EGE topic by its first task
   * number, or a course picture, square (3:2) or `wide` for the catalog card
   * (built by scripts/mascot).
   */
  export type Props = (
    | { topic: number; course?: never; wide?: never }
    | { course: Course; wide?: boolean; topic?: never }
  ) & {
    className?: string;
  };
}
