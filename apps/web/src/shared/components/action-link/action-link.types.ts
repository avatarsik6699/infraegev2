export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    presentation?: "inline" | "action" | "navigation" | "button";
    hierarchy?: "primary" | "secondary" | "quiet" | "text";
    icon?: "back" | "forward" | "login" | "none";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
    search?: { returnTo: string };
  };
}
