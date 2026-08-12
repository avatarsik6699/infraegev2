export namespace PageContainerTypes {
  export type Props = {
    children: React.ReactNode;
    component?: "main" | "header" | "footer" | "section" | "div";
    className?: string;
    size?: string;
  };
}
