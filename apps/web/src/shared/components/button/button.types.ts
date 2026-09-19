import type { ComponentPropsWithRef } from "react";

export namespace ButtonTypes {
  export type Hierarchy =
    "primary" | "secondary" | "soft" | "quiet" | "destructive";
  export type Density = "compact" | "default";

  export type Props = Omit<ComponentPropsWithRef<"button">, "color"> & {
    hierarchy?: Hierarchy;
    surface?: "default" | "code" | "bare";
    density?: Density;
    loading?: boolean;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    fullWidth?: boolean;
    iconOnly?: boolean;
  };
}
