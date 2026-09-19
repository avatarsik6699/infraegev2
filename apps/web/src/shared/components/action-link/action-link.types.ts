export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    presentation?: "inline" | "action" | "navigation" | "button";
    hierarchy?: "secondary" | "quiet" | "text";
    icon?: "back" | "forward" | "none";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
  };
}
