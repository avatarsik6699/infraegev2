export namespace PageHeadTypes {
  export type Props = {
    /** F24: a catalog head — one title, lead and meta size on every page. */
    title?: React.ReactNode;
    titleId?: string;
    lead?: React.ReactNode;
    /** Quiet secondary facts under the lead, one line per child. */
    meta?: React.ReactNode;
    /** Free content: the home hero, or blocks after the meta. */
    children?: React.ReactNode;
    aside?: React.ReactNode;
    /**
     * Keep the aside under the copy on narrow screens instead of hiding it
     * (the `/ege` exam map, Change 185); decorative asides stay hidden.
     */
    asideOnNarrow?: boolean | "after-heading";
    /** A line above the title, e.g. a course's icon and kind (Change 186). */
    eyebrow?: React.ReactNode;
    /**
     * Replaces the engineering grid with the page's own decorative backdrop;
     * the head then has no bottom rule (the backdrop fades into the page).
     */
    backdrop?: React.ReactNode;
    className?: string;
  };
}
