export namespace ActionLinkTypes {
  export type RootProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    presentation?: "inline" | "action" | "navigation" | "button" | "reference";
    hierarchy?: "primary" | "secondary" | "quiet" | "text";
    icon?: "back" | "forward" | "login" | "none";
    ariaLabel?: string;
  };

  export type Props = RootProps & {
    to: string;
    params?: Record<string, string>;
    search?:
      | { returnTo: string; token?: string }
      /** Change 192: /pricing and /subscribe return to the page they came from. */
      | { from?: string; plan?: "month" | "year" }
      /** Change 192: the profile opens on a tab. */
      | { tab: "access" };
  };
}
