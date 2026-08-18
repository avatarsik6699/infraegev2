export namespace NotationTypes {
  /** Matches docs/FRONTEND.md: `code` for code fragments
   * (data font), `var` for math/algorithm variables (reading serif, no
   * italic). Renders the matching native tag — not a styling-only choice. */
  export type Kind = "code" | "var";

  export type Props = {
    kind?: Kind;
    children: React.ReactNode;
    className?: string;
  };
}
