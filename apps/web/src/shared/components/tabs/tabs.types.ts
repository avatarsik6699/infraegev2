import type { ComponentPropsWithoutRef } from "react";

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export namespace TabsTypes {
  export type RootProps = {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
  };

  export type ListProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
    hidden?: boolean;
  };

  export type TabProps = {
    value: string;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    disabled?: boolean;
    tabProps?: Omit<
      ComponentPropsWithoutRef<"button">,
      "aria-label" | "children" | "className" | "disabled"
    > &
      DataAttributes;
  };

  export type PanelProps = {
    value: string;
    children: React.ReactNode;
    className?: string;
    focusable?: boolean;
    panelProps?: Omit<
      ComponentPropsWithoutRef<"div">,
      "children" | "className" | "hidden" | "role" | "tabIndex"
    > &
      DataAttributes;
  };
}
