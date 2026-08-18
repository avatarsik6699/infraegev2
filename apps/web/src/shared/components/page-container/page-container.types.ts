import type { HTMLAttributes } from "react";

export namespace PageContainerTypes {
  export type Measure = "reading" | "wide" | "full";
  export type Component = "main" | "header" | "footer" | "section" | "div";

  export type Props = HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
    component?: Component;
    measure?: Measure;
  };
}
