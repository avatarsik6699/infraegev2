import type { LessonTypes } from "~/entities/lesson";

export namespace LessonOutlineTypes {
  export type Props = {
    groups: LessonTypes.OutlineGroup[];
    activeId?: string;
    className?: string;
  };
}
