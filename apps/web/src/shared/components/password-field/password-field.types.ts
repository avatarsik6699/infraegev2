import type { Field } from "~/shared/components/field";

export namespace PasswordFieldTypes {
  export type Props = Omit<
    React.ComponentProps<typeof Field>,
    "type" | "endAdornment"
  >;
}
