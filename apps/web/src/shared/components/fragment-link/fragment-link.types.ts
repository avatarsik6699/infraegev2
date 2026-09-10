import type { ComponentProps } from "react";

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export namespace FragmentLinkTypes {
  export type Props = {
    hash: string;
    children: React.ReactNode;
    className?: string;
    /** Leading link icon; omitted by navigation lists with their own indicators. */
    icon?: boolean;
    hierarchy?: "text" | "drawn";
    anchorProps?: Omit<ComponentProps<"a">, "children" | "className" | "href"> &
      DataAttributes;
  };
}
