export namespace ActionLinkTypes {
  export type Props = {
    to: string;
    children: React.ReactNode;
    hierarchy?: "secondary" | "quiet" | "text";
    icon?: "back" | "forward";
    className?: string;
    ariaLabel?: string;
  };
}
