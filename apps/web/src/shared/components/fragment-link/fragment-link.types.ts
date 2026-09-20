import type { ComponentProps } from "react";

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export namespace FragmentLinkTypes {
  export type Props = {
    hash: string;
    children: React.ReactNode;
    className?: string;
    /** Lucide Link icon for a fragment; omitted by navigation lists. */
    icon?: boolean;
    presentation?: "inline" | "action";
    hierarchy?: "text";
    anchorProps?: Omit<ComponentProps<"a">, "children" | "className" | "href"> &
      DataAttributes;
  };
}
