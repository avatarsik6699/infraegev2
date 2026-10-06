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
    className?: string;
  };
}
