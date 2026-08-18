import type { ComponentPropsWithoutRef } from "react";

export namespace ButtonTypes {
  export type Hierarchy = "primary" | "secondary" | "quiet";
  export type Density = "compact" | "default";

  export type Props = Omit<ComponentPropsWithoutRef<"button">, "color"> & {
    hierarchy?: Hierarchy;
    density?: Density;
    loading?: boolean;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    fullWidth?: boolean;
  };
}
