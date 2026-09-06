export namespace CustomIconTypes {
  export type RootProps = Omit<
    React.SVGProps<SVGSVGElement>,
    "aria-label" | "children" | "viewBox"
  > & {
    children: React.ReactNode;
    label?: string;
    viewBox: string;
  };

  export type GlyphProps = Omit<RootProps, "children" | "viewBox">;
}
