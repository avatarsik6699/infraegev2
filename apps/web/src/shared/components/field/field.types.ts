import type { InputTypes } from "~/shared/components/input";

export namespace FieldTypes {
  export type Props = InputTypes.Props & {
    label: string;
    endAdornment?: React.ReactNode;
    labelVisibility?: "visible" | "sr-only";
    description?: string;
    help?: React.ReactNode;
    error?: string;
    /** An accepted answer: green border and fill with a check (no circle). */
    success?: boolean;
  };
}
