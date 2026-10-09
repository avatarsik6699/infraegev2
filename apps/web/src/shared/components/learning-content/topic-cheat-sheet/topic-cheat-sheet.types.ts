export namespace TopicCheatSheetTypes {
  export type Row = { key: React.ReactNode; note: React.ReactNode };

  export type Group = {
    /** Number of the subtopic the block summarises. */
    number: number;
    /** Title, usually a link to the subtopic page. */
    title: React.ReactNode;
    /** Text mark for an advanced subtopic, e.g. «дополнительный урок». */
    level?: string;
    rows: readonly Row[];
  };

  /** A topic-wide block under the subtopics, e.g. where candidates come from. */
  export type Section = {
    title: string;
    /** Key → note rows; `columns` lays them out in two columns and widens the block. */
    rows?: readonly Row[];
    columns?: boolean;
    /** A numbered list, e.g. the final checks. */
    steps?: readonly React.ReactNode[];
    note?: React.ReactNode;
  };

  export type Props = {
    label: string;
    flow: readonly { name: string; note: string }[];
    groups: readonly Group[];
    sections?: readonly Section[];
    caption: React.ReactNode;
  };
}
