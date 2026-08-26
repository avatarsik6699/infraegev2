export namespace LessonTypes {
  export type OutlineItem = {
    id: string;
    label: string;
  };

  export type OutlineGroup = {
    id: string;
    label: string;
    items: OutlineItem[];
  };
}
