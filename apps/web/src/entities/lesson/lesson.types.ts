export namespace LessonTypes {
  export type OutlineItem = {
    id: string;
    label: string;
    /** Change 192: a paid section behind the paywall — named, not linked. */
    locked?: boolean;
  };
}
