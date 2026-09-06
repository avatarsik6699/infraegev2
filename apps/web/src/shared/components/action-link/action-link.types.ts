export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    hierarchy?: "secondary" | "quiet" | "text" | "drawn";
    icon?: "back" | "forward";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
  };
}
