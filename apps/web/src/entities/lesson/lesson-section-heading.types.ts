import type { ComponentProps, ReactNode } from "react";

export namespace LessonSectionHeadingTypes {
  export type Props = Omit<ComponentProps<"h2">, "children"> & {
    index: number;
    children: ReactNode;
  };
}
