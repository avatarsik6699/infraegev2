import type { InputTypes } from "~/shared/components/input";

export namespace FieldTypes {
  export type Props = InputTypes.Props & {
    label: string;
    endAdornment?: React.ReactNode;
    labelVisibility?: "visible" | "sr-only";
    description?: string;
    error?: string;
  };
}
