import type { ComponentPropsWithRef } from "react";

export namespace ButtonTypes {
  export type Hierarchy = "primary" | "secondary" | "quiet";
  export type Density = "compact" | "default";

  export type Props = Omit<ComponentPropsWithRef<"button">, "color"> & {
    hierarchy?: Hierarchy;
    surface?: "default" | "code";
    density?: Density;
    loading?: boolean;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    fullWidth?: boolean;
    iconOnly?: boolean;
  };
}
