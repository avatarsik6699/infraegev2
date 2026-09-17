import type { ComponentPropsWithoutRef } from "react";

export namespace SelectFieldTypes {
  export type Props = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
    label: string;
    options: readonly { value: string; label: string }[];
  };
}
