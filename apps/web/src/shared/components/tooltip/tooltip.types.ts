export namespace TooltipTypes {
  export type Props = {
    /** What the tooltip says; keep it short — it is read on hover or focus. */
    content: React.ReactNode;
    /**
     * The one element that opens it on hover and focus. Tooltip text is
     * visual: give the control an accessible description of its own.
     */
    children: React.ReactElement<Record<string, unknown>>;
    side?: "top" | "bottom";
  };
}
