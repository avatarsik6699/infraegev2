export namespace LessonTableTypes {
  export type Column = {
    label: React.ReactNode;
    /** Numbers: right-aligned in the data face with tabular figures. */
    numeric?: boolean;
  };

  export type Props = {
    /** Accessible name of the scroll region, e.g. «Делители 12». */
    label: string;
    columns: readonly Column[];
    rows: readonly (readonly React.ReactNode[])[];
    className?: string;
  };
}
