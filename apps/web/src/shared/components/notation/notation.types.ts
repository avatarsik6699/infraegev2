export namespace NotationTypes {
  /** `formula` renders a semantic `var`; both kinds use the shared data
   * register so inline evidence stays visually consistent. */
  export type Kind = "code" | "formula";

  export type Props = {
    kind?: Kind;
    emphasis?: "highlight";
    children: React.ReactNode;
    className?: string;
  };
}
