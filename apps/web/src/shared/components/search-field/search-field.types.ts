export namespace SearchFieldTypes {
  /** `[start, end)` offsets of a match. */
  export type Range = readonly number[];

  /** Change 191 (F2): one matching item under the field while typing. */
  export type Suggestion = {
    id: string;
    title: string;
    titleHighlights: readonly Range[];
    /** A short marker before the title, e.g. «№ 8». */
    meta?: string;
    snippet?: string | null;
    snippetHighlights: readonly Range[];
  };

  export type Suggestions = {
    /** False while the text is too short to search. */
    active: boolean;
    loading: boolean;
    items: readonly Suggestion[];
    /** All matches; null until the first response. */
    total: number | null;
    listLabel: string;
    emptyLabel: string;
    loadingLabel: string;
    showAllLabel: (total: number) => string;
    onSelect: (id: string) => void;
  };

  export type Props = {
    label: string;
    labelVisibility?: "visible" | "sr-only";
    name: string;
    placeholder: string;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    maxLength?: number;
    submitLabel: string;
    clearLabel: string;
    suggestions?: Suggestions;
  };
}
