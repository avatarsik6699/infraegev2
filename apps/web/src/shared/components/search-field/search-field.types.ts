export namespace SearchFieldTypes {
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
  };
}
