import type { ComponentPropsWithRef } from "react";

export namespace InputTypes {
  export type Props = Omit<ComponentPropsWithRef<"input">, "color" | "size"> & {
    invalid?: boolean;
  };
}
