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
  };
}
