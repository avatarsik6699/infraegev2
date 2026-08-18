import type { ComponentPropsWithoutRef } from "react";

export namespace InputTypes {
  export type Props = Omit<
    ComponentPropsWithoutRef<"input">,
    "color" | "size"
  > & {
    invalid?: boolean;
  };
}
