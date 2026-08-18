import type { ComponentProps } from "react";

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export namespace FragmentLinkTypes {
  export type Props = {
    hash: string;
    children: React.ReactNode;
    className?: string;
    /** Trailing affordance arrow, on by default. Turn off where the caller
     * already draws its own navigation affordance (e.g. the lesson outline's
     * SVG nodes) so the two don't compete. */
    icon?: boolean;
    anchorProps?: Omit<ComponentProps<"a">, "children" | "className" | "href"> &
      DataAttributes;
  };
}
