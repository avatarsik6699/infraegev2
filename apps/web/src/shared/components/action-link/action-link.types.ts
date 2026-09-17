export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    presentation?: "inline" | "action";
    hierarchy?: "secondary" | "quiet" | "text";
    icon?: "back" | "forward";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
  };
}
