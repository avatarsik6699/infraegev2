export namespace ExternalLinkTypes {
  export type Props = {
    href: string;
    children: React.ReactNode;
    newTab?: boolean;
    className?: string;
    ariaLabel?: string;
  };
}
