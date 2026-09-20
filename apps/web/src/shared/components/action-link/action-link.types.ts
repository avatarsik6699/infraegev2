export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    presentation?: "inline" | "action" | "navigation" | "button";
    hierarchy?: "primary" | "secondary" | "quiet" | "text";
    hoverEffect?: "scale";
    icon?: "back" | "forward" | "none";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
  };
}
