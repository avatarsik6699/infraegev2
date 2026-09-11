export namespace DiagramTypes {
  export type Props = {
    src: string;
    alt: string;
    caption: string;
    purpose: string;
    width?: number;
    height?: number;
    description?: React.ReactNode;
    className?: string;
  };
}
