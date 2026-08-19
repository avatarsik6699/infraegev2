export namespace NotationTypes {
  /** `formula` renders a semantic `var`; both kinds use the shared data
   * register so inline evidence stays visually consistent. */
  export type Kind = "code" | "formula";

  export type Props = {
    kind?: Kind;
    children: React.ReactNode;
    className?: string;
  };
}
