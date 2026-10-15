export namespace MultiComboboxTypes {
  export type Option = {
    value: string;
    label: string;
    description: string;
    group: string;
  };
  export type Props = {
    label: string;
    emptySelectionLabel: string;
    selectedLabel: string;
    searchPlaceholder: string;
    emptyLabel: string;
    options: Option[];
    value: string[];
    onApply: (values: string[]) => void;
    /** «field» (default): a labelled field; «inline»: «Тема: Все темы ⌄» text,
     * as the InlineSelect beside it (Change 185, F48). */
    presentation?: "field" | "inline";
    /** A muted line under the list, e.g. what is not in it yet. */
    note?: string;
  };
}
