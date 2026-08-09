export namespace PageContainerTypes {
  export type Props = {
    children: React.ReactNode;
    component?: "main" | "footer" | "section" | "div";
    className?: string;
  };
}
