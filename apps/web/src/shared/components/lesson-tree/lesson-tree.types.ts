export namespace LessonTreeTypes {
  export type File = {
    id: string;
    marker: React.ReactNode;
    label: string;
    /** Muted text after the label, e.g. « · 12». */
    count?: string;
    /** Router target; a file without one is planned and stays muted. */
    to?: string;
    params?: Record<string, string>;
    current?: boolean;
    done?: boolean;
    /** Quiet caption above this file that opens a group, e.g. «Дополнительные уроки». */
    groupLabel?: string;
    /** Read after the label, e.g. «дополнительный урок»; the caption already shows it. */
    note?: string;
  };

  export type Folder = {
    id: string;
    marker: React.ReactNode;
    label: string;
    open: boolean;
    files: readonly File[];
  };

  export type Props = {
    /** Accessible name of the `nav`. */
    ariaLabel: string;
    /** The phone disclosure label, e.g. «Подтемы · 2 из 5». */
    disclosureLabel: string;
    /** The quiet caption above the tree. */
    rootLabel: string;
    folders: readonly Folder[];
    /** Read after the label of a done file, e.g. «задачи решены». */
    doneLabel?: string;
    /** Lesson progress shown under the tree on narrow screens (F38). */
    progress?: React.ReactNode;
    /** Extra attributes for the `nav` (e.g. a data hook). */
    navProps?: Record<`data-${string}`, string | boolean>;
  };
}
