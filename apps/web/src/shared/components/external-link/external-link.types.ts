export namespace ExternalLinkTypes {
  export type Hierarchy = "default" | "drawn";

  export type Props = {
    href: string;
    children: React.ReactNode;
    newTab?: boolean;
    className?: string;
    ariaLabel?: string;
    hierarchy?: Hierarchy;
  };
}
