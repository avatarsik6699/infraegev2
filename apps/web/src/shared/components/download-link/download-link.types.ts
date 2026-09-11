export namespace DownloadLinkTypes {
  export type Props = {
    href: string;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    downloadName?: string;
    presentation?: "inline" | "action";
  };
}
