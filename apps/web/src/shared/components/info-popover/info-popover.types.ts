export namespace InfoPopoverTypes {
  export type Props = {
    label: string;
    children: React.ReactNode;
    /** Adds a close button to the scripted popup, e.g. «Закрыть». */
    closeLabel?: string;
    /**
     * Inside running text: without scripting a native `popover` (phrasing
     * content) replaces the `details` fallback, which would split a paragraph.
     */
    inline?: boolean;
    /**
     * Visible text that opens the popup instead of the «?» icon, e.g. a term
     * in a sentence; it then names the trigger itself.
     */
    trigger?: React.ReactNode;
  };
}
