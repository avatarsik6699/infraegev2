import type { LessonTypes } from "~/entities/lesson";

export namespace LessonOutlineTypes {
  export type ContentProps = {
    groups: LessonTypes.OutlineGroup[];
    activeId: string;
    activeGroupId?: string;
    activeGroupIndex: number;
    onNavigate: (
      id: string,
      event: React.MouseEvent<HTMLAnchorElement>,
    ) => void;
  };
  export type Props = {
    groups: LessonTypes.OutlineGroup[];
    activeId?: string;
    className?: string;
  };
}
