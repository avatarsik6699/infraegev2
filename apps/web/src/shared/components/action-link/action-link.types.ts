export namespace ActionLinkTypes {
  export type Props = {
    to: string;
    children: React.ReactNode;
    hierarchy?: "secondary" | "quiet";
    className?: string;
    ariaLabel?: string;
  };
}
