import type { InputTypes } from "~/shared/components/input";

export namespace FieldTypes {
  export type Props = InputTypes.Props & {
    label: string;
    description?: string;
    error?: string;
  };
}
