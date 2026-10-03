import type { LessonTypes } from "~/entities/lesson";

export namespace LessonOutlineTypes {
  export type PageProps = {
    items: readonly LessonTypes.OutlineItem[];
  };
}
