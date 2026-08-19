import type { InputTypes } from "~/shared/components/input";

export namespace FieldTypes {
  export type Props = InputTypes.Props & {
    label: string;
    labelVisibility?: "visible" | "sr-only";
    description?: string;
    error?: string;
  };
}
