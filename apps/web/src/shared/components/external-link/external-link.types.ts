export namespace ExternalLinkTypes {
  export type Props = {
    href: string;
    children: React.ReactNode;
    newTab?: boolean;
    className?: string;
    ariaLabel?: string;
    presentation?: "inline" | "action";
    /** Change 226: "none" drops the trailing arrow (links side by side). */
    icon?: "none";
  };
}
